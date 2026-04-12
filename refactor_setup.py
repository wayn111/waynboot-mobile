import os
import re
import glob

# 生命周期钩子映射：Vue 2 -> Vue 3 Composition API
LIFECYCLE_HOOKS = {
    'beforeCreate': None,  # 代码将直接放在 setup 中
    'created': None,       # 代码将直接放在 setup 中
    'beforeMount': 'onBeforeMount',
    'mounted': 'onMounted',
    'beforeUpdate': 'onBeforeUpdate',
    'updated': 'onUpdated',
    'beforeDestroy': 'onBeforeUnmount',
    'destroyed': 'onUnmounted',
    'activated': 'onActivated',
    'deactivated': 'onDeactivated'
}

def parse_top_level_items(section_content):
    """
    解析 Options API 内部 section（如 methods: { ... }）的顶级函数。
    支持匹配：name() { ... } 或 name: (args) => { ... } 或 name: function() { ... }
    使用大括号计数法来处理嵌套函数。
    """
    if not section_content: return []
    items = []
    # 匹配函数名、参数
    pattern = r'(\w+)\s*(?:\((.*?)\)|:\s*(?:function)?\s*\((.*?)\)\s*=>?)\s*\{'
    pos = 0
    while True:
        match = re.search(pattern, section_content[pos:])
        if not match: break
        
        name = match.group(1)
        params = match.group(2) if match.group(2) is not None else (match.group(3) if match.group(3) is not None else "")
        start_brace = pos + match.end() - 1
        
        # 寻找匹配的闭合大括号
        brace_count = 0
        end_brace = -1
        for i in range(start_brace, len(section_content)):
            if section_content[i] == '{': brace_count += 1
            elif section_content[i] == '}':
                brace_count -= 1
                if brace_count == 0:
                    end_brace = i
                    break
        if end_brace != -1:
            body = section_content[start_brace+1:end_brace]
            items.append((name, params, body))
            pos = end_brace + 1
        else: break
    return items

def refactor_vue_file(file_path):
    """核心转换函数"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 跳过已经包含 script setup 的文件
    if '<script setup>' in content:
        return False

    # 1. 提取 <script> 内容
    script_match = re.search(r'<script.*?>([\s\S]*?)</script>', content)
    if not script_match: return False
    
    script_content = script_match.group(1)
    
    # 2. 提取 export default { ... } 内容
    export_match = re.search(r'export\s+default\s+\{([\s\S]*)\}', script_content)
    if not export_match: return False
    
    body = export_match.group(1).strip()
    
    new_script_parts = []
    vue_imports = set()
    v_router_imports = set()
    v_store_imports = set()
    
    data_keys = set()
    prop_keys = set()
    method_keys = set()
    computed_keys = set()

    # --- 开始转换各部分 ---

    # Components -> 不需要在 script setup 中声明，只需保留 import
    
    # Props -> defineProps
    props_match = re.search(r'props:\s*(\{(?:[^{}]*|\{(?:[^{}]*|\{[^{}]*\})*\})*\})', body)
    if props_match:
        props_str = props_match.group(1)
        new_script_parts.append(f'const props = defineProps({props_str})')
        # 提取 prop 键名 (简化处理)
        prop_keys.update(re.findall(r'(\w+)\s*:', props_str))

    # Data -> reactive (或者 refs)
    # 匹配 data() { return { ... } }
    data_match = re.search(r'data\s*\(\)\s*\{\s*return\s*(\{(?:[^{}]*|\{(?:[^{}]*|\{[^{}]*\})*\})*\})\s*\}', body)
    if data_match:
        data_obj = data_match.group(1)
        vue_imports.add('reactive')
        vue_imports.add('toRefs')
        new_script_parts.append(f'const state = reactive({data_obj})')
        new_script_parts.append(f'const {{ {", ".join(re.findall(r"([a-zA-Z0-9_]+)\s*:", data_obj))} }} = toRefs(state)')
        data_keys.update(re.findall(r'([a-zA-Z0-9_]+)\s*:', data_obj))

    # Computed -> computed()
    computed_match = re.search(r'computed:\s*(\{(?:[^{}]*|\{(?:[^{}]*|\{[^{}]*\})*\})*\})', body)
    if computed_match:
        vue_imports.add('computed')
        for name, params, fbody in parse_top_level_items(computed_match.group(1)):
            computed_keys.add(name)
            new_script_parts.append(f'const {name} = computed(({params}) => {{{fbody}}})')

    # Methods -> const name = () => { ... }
    methods_match = re.search(r'methods:\s*(\{(?:[^{}]*|\{(?:[^{}]*|\{[^{}]*\})*\})*\})', body)
    if methods_match:
        for name, params, fbody in parse_top_level_items(methods_match.group(1)):
            method_keys.add(name)
            new_script_parts.append(f'const {name} = ({params}) => {{{fbody}}}')

    # Watch -> watch()
    watch_match = re.search(r'watch:\s*(\{(?:[^{}]*|\{(?:[^{}]*|\{[^{}]*\})*\})*\})', body)
    if watch_match:
        vue_imports.add('watch')
        for name, params, fbody in parse_top_level_items(watch_match.group(1)):
            # 简单的 watch 处理
            target = f'state.{name}' if name in data_keys else name
            new_script_parts.append(f"watch(() => {target}, ({params}) => {{{fbody}}})")

    # Lifecycle Hooks
    for old_h, new_h in LIFECYCLE_HOOKS.items():
        # 匹配 hook() { ... }
        pattern = r'\b' + old_h + r'\s*\((.*?)\)\s*\{'
        match = re.search(pattern, body)
        if match:
            params = match.group(1)
            start_brace = match.end() - 1
            brace_count = 0
            end_brace = -1
            for i in range(start_brace, len(body)):
                if body[i] == '{': brace_count += 1
                elif body[i] == '}':
                    brace_count -= 1
                    if brace_count == 0:
                        end_brace = i
                        break
            if end_brace != -1:
                h_body = body[start_brace+1:end_brace]
                if new_h:
                    vue_imports.add(new_h)
                    new_script_parts.append(f'{new_h}(({params}) => {{{h_body}}})')
                else:
                    new_script_parts.append(f'// {old_h} logic\n{h_body}')

    full_new_code = "\n\n".join(new_script_parts)

    # --- 替换 this. 引用 ---
    
    if 'this.$router' in full_new_code: 
        v_router_imports.add('useRouter')
        full_new_code = full_new_code.replace('this.$router', 'router')
    if 'this.$route' in full_new_code: 
        v_router_imports.add('useRoute')
        full_new_code = full_new_code.replace('this.$route', 'route')
    if 'this.$store' in full_new_code: 
        v_store_imports.add('useStore')
        full_new_code = full_new_code.replace('this.$store', 'store')
    
    full_new_code = full_new_code.replace('this.$toast', 'showToast')
    full_new_code = full_new_code.replace('this.$dialog', 'showDialog')
    full_new_code = full_new_code.replace('this.$notify', 'showNotify')
    full_new_code = full_new_code.replace('this.$emit', 'emit')
    
    if 'emit(' in full_new_code:
        # 尝试提取 emits，这里简化为 defineEmits
        new_script_parts.insert(0, "const emit = defineEmits([]) // TODO: add emits")

    # 替换 Data 成员为 state.xxx (因为我们用 toRefs 解构了，也可以直接用 xxx.value，但为了稳妥先用 state.xxx 或直接 xxx.value)
    # 因为用 toRefs 了解构，可以直接用 xxx.value
    for k in data_keys:
        full_new_code = re.sub(rf'this\.{k}\b', f'{k}.value', full_new_code)
        
    for k in prop_keys:
        full_new_code = re.sub(rf'this\.{k}\b', f'props.{k}', full_new_code)
        
    for k in method_keys | computed_keys:
        full_new_code = re.sub(rf'this\.{k}\b', k, full_new_code)
        
    # 移除剩余的 this. (可能会破坏一些未识别的东西，但这是 best-effort)
    full_new_code = re.sub(r'this\.', '', full_new_code)

    # --- 整理 Imports ---
    existing_imports = re.findall(r'^import\s+.*$', script_content, re.MULTILINE)
    
    header = []
    header.extend(existing_imports)
    if vue_imports: header.append(f"import {{ {', '.join(sorted(vue_imports))} }} from 'vue'")
    if v_router_imports: header.append(f"import {{ {', '.join(sorted(v_router_imports))} }} from 'vue-router'")
    if v_store_imports: header.append(f"import {{ {', '.join(sorted(v_store_imports))} }} from 'vuex'")
    
    setup_boilerplate = []
    if 'useRouter' in v_router_imports: setup_boilerplate.append('const router = useRouter()')
    if 'useRoute' in v_router_imports: setup_boilerplate.append('const route = useRoute()')
    if 'useStore' in v_store_imports: setup_boilerplate.append('const store = useStore()')

    final_script = f"""<script setup>
{chr(10).join(header)}

{chr(10).join(setup_boilerplate)}

{full_new_code}
</script>"""

    # 替换
    new_content = content.replace(script_match.group(0), final_script)

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
        
    print(f"[OK] 已转换: {file_path}")
    return True

if __name__ == '__main__':
    vue_files = glob.glob('src/**/*.vue', recursive=True)
    count = 0
    for file in vue_files:
        try:
            if refactor_vue_file(file):
                count += 1
        except Exception as e:
            print(f"[Error] 处理文件 {file} 时发生错误: {e}")

    print(f"转换完成！共转换了 {count} 个文件。")

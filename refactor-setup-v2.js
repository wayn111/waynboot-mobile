const fs = require('fs');
const path = require('path');
const glob = require('fast-glob');

// 生命周期钩子映射
const HOOKS_MAP = {
  'beforeCreate': null,
  'created': null,
  'beforeMount': 'onBeforeMount',
  'mounted': 'onMounted',
  'beforeUpdate': 'onBeforeUpdate',
  'updated': 'onUpdated',
  'beforeUnmount': 'onBeforeUnmount',
  'beforeDestroy': 'onBeforeUnmount',
  'unmounted': 'onUnmounted',
  'destroyed': 'onUnmounted',
  'activated': 'onActivated',
  'deactivated': 'onDeactivated',
};

/**
 * 核心匹配函数：寻找闭合括号
 */
function findClosingBracket(content, startIndex, openChar = '{', closeChar = '}') {
  let depth = 0;
  let foundOpen = false;
  for (let i = startIndex; i < content.length; i++) {
    if (content[i] === openChar) {
      depth++;
      foundOpen = true;
    } else if (content[i] === closeChar) {
      depth--;
    }
    if (foundOpen && depth === 0) return i;
  }
  return -1;
}

/**
 * 提取对象中的顶层属性块
 */
function extractSection(body, key) {
  const regex = new RegExp(`\\b${key}\\s*[:(]`);
  const match = body.match(regex);
  if (!match) return null;

  const start = match.index;
  const braceStart = body.indexOf('{', start);
  if (braceStart === -1) return null;
  
  const braceEnd = findClosingBracket(body, braceStart);
  if (braceEnd === -1) return null;

  return {
    full: body.substring(start, braceEnd + 1),
    content: body.substring(braceStart + 1, braceEnd).trim(),
    start,
    end: braceEnd + 1
  };
}

/**
 * 解析方法或计算属性
 */
function parseMethods(content) {
  const methods = [];
  let pos = 0;
  // 匹配 name() { 或 name: function() { 或 name: (args) => {
  const methodRegex = /(\w+)\s*(?:\((.*?)\)|:\s*(?:function)?\s*\((.*?)\)\s*=>?)\s*\{/g;
  let match;
  while ((match = methodRegex.exec(content)) !== null) {
    const name = match[1];
    const args = match[2] || match[3] || '';
    const start = match.index + match[0].length - 1;
    const end = findClosingBracket(content, start);
    if (end !== -1) {
      const body = content.substring(start + 1, end).trim();
      methods.push({ name, args, body });
      methodRegex.lastIndex = end + 1;
    }
  }
  return methods;
}

async function convertFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  if (content.includes('<script setup>')) return;

  const scriptMatch = content.match(/<script.*?>([\s\S]*?)<\/script>/);
  if (!scriptMatch) return;

  const scriptContent = scriptMatch[1];
  const exportMatch = scriptContent.match(/export\s+default\s+\{/);
  if (!exportMatch) return;

  const exportStart = exportMatch.index;
  const exportEnd = findClosingBracket(scriptContent, exportStart + exportMatch[0].length - 1);
  const exportBody = scriptContent.substring(exportStart + exportMatch[0].length - 1, exportEnd + 1);

  let newScript = scriptContent.substring(0, exportStart).trim() + '\n\n';
  const vueImports = new Set();
  const routerImports = new Set();
  const storeImports = new Set();

  const dataKeys = [];
  const propKeys = [];

  // 1. 处理 Props
  const propsSec = extractSection(exportBody, 'props');
  if (propsSec) {
    newScript += `const props = defineProps({${propsSec.content}})\n\n`;
    // 简单提取 key
    const keys = propsSec.content.match(/(\w+)\s*:/g);
    if (keys) propKeys.push(...keys.map(k => k.replace(':', '').trim()));
  }

  // 2. 处理 Data
  const dataSec = extractSection(exportBody, 'data');
  if (dataSec) {
    vueImports.add('reactive');
    vueImports.add('toRefs');
    const dataMatch = dataSec.content.match(/return\s*\{([\s\S]*)\}/);
    if (dataMatch) {
      const dataBody = dataMatch[1].trim();
      newScript += `const state = reactive({${dataBody}})\n`;
      const keys = dataBody.match(/(\w+)\s*:/g);
      if (keys) {
        const kList = keys.map(k => k.replace(':', '').trim());
        dataKeys.push(...kList);
        newScript += `const { ${kList.join(', ')} } = toRefs(state)\n\n`;
      }
    }
  }

  // 3. 处理 Methods
  const methodsSec = extractSection(exportBody, 'methods');
  if (methodsSec) {
    const methods = parseMethods(methodsSec.content);
    methods.forEach(m => {
      newScript += `const ${m.name} = (${m.args}) => {\n  ${m.body}\n}\n\n`;
    });
  }

  // 4. 处理 Computed
  const computedSec = extractSection(exportBody, 'computed');
  if (computedSec) {
    vueImports.add('computed');
    const methods = parseMethods(computedSec.content);
    methods.forEach(m => {
      newScript += `const ${m.name} = computed(() => {\n  ${m.body}\n})\n\n`;
    });
  }

  // 5. 处理 生命周期
  Object.entries(HOOKS_MAP).forEach(([oldHook, newHook]) => {
    const sec = extractSection(exportBody, oldHook);
    if (sec) {
      const body = sec.content.replace(/^\s*\((.*?)\)\s*\{/, '').trim();
      if (newHook) {
        vueImports.add(newHook);
        newScript += `${newHook}(() => {\n  ${body}\n})\n\n`;
      } else {
        newScript += `// ${oldHook}\n${body}\n\n`;
      }
    }
  });

  // --- 后处理：替换 this. ---
  newScript = newScript.replace(/this\.\$router/g, 'router');
  newScript = newScript.replace(/this\.\$route/g, 'route');
  newScript = newScript.replace(/this\.\$store/g, 'store');
  newScript = newScript.replace(/this\.\$emit/g, 'emit');
  newScript = newScript.replace(/this\.\$nextTick/g, 'nextTick');
  
  if (newScript.includes('router')) routerImports.add('useRouter');
  if (newScript.includes('route')) routerImports.add('useRoute');
  if (newScript.includes('store')) storeImports.add('useStore');
  if (newScript.includes('nextTick')) vueImports.add('nextTick');
  if (newScript.includes('emit')) newScript = `const emit = defineEmits([])\n` + newScript;

  // 替换 data 成员: this.xxx -> xxx.value
  dataKeys.forEach(key => {
    const reg = new RegExp(`this\\.${key}\\b`, 'g');
    newScript = newScript.replace(reg, `${key}.value`);
  });

  // 替换 prop 成员: this.xxx -> props.xxx
  propKeys.forEach(key => {
    const reg = new RegExp(`this\\.${key}\\b`, 'g');
    newScript = newScript.replace(reg, `props.${key}`);
  });

  // 替换其他 this.xxx (方法或计算属性) -> xxx
  newScript = newScript.replace(/this\.(\w+)\b/g, '$1');

  // 整理 Imports
  let importHeader = '';
  if (vueImports.size > 0) importHeader += `import { ${Array.from(vueImports).join(', ')} } from 'vue'\n`;
  if (routerImports.size > 0) importHeader += `import { ${Array.from(routerImports).join(', ')} } from 'vue-router'\n`;
  if (storeImports.size > 0) importHeader += `import { ${Array.from(storeImports).join(', ')} } from 'vuex'\n`;
  
  let setupBoilerplate = '';
  if (routerImports.has('useRouter')) setupBoilerplate += 'const router = useRouter()\n';
  if (routerImports.has('useRoute')) setupBoilerplate += 'const route = useRoute()\n';
  if (storeImports.has('useStore')) setupBoilerplate += 'const store = useStore()\n';

  const finalScript = `<script setup>\n${importHeader}\n${setupBoilerplate}\n${newScript.trim()}\n</script>`;
  const newFileContent = content.replace(scriptMatch[0], finalScript);

  fs.writeFileSync(filePath, newFileContent);
  console.log(`[OK] Converted: ${filePath}`);
}

async function run() {
  const files = await glob(['src/**/*.vue']);
  for (const file of files) {
    try {
      await convertFile(file);
    } catch (e) {
      console.error(`[Error] Failed ${file}:`, e.message);
    }
  }
}

run();
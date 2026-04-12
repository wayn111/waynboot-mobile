const $ = require('gogocode');
const fs = require('fs');
const path = require('path');
const glob = require('fast-glob');
const plugin = require('gogocode-plugin-vue');

async function run() {
  const files = await glob(['src/**/*.vue']);
  
  files.forEach(filePath => {
    const source = fs.readFileSync(filePath, 'utf8');
    
    try {
      const res = $(source, { parseOptions: { language: 'vue' } })
        .transform(plugin)
        .generate();

      if (res !== source) {
        fs.writeFileSync(filePath, res);
        console.log(`已转换: ${filePath}`);
      }
    } catch(e) {
      console.error(`转换失败: ${filePath}`, e.message);
    }
  });
}

run();
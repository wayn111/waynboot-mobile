const fs = require('fs');
const path = require('path');
const glob = require('fast-glob');

const files = glob.sync(['src/**/*.vue'], { absolute: true });

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes('v-model:value="')) {
    // Replace v-model:value="xxx" with v-model="xxx"
    content = content.replace(/v-model:value="/g, 'v-model="');
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated v-model in ${file}`);
  }
});

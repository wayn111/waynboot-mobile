const fs = require('fs');
const path = require('path');

function replaceVDeep(files) {
  for (const file of files) {
    const fullPath = path.resolve(process.cwd(), file);
    if (fs.existsSync(fullPath)) {
      let content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes('::v-deep')) {
        content = content.replace(/::v-deep\s+([^{]+)/g, ':deep($1)');
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated ::v-deep in ${file}`);
      }
    }
  }
}

const files = [
  'src/views/detail/modules/Description.vue',
  'src/views/goodsComment/index.vue',
  'src/views/auth/login.vue',
  'src/views/home/modules/Swiper.vue',
  'src/views/home/modules/GoodsLimit.vue'
];

replaceVDeep(files);

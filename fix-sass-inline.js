const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function replaceFiles(files) {
  for (const file of files) {
    const fullPath = path.resolve(process.cwd(), file);
    if (fs.existsSync(fullPath)) {
      let content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes("import variables from '@/styles/variables.scss'")) {
        content = content.replace(
          /import variables from '@\/styles\/variables\.scss'/g,
          "import variables from '@/styles/variables.scss?inline'"
        );
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated ${file}`);
      }
    }
  }
}

const files = [
  'src/views/detail/modules/Comment.vue',
  'src/components/CommentItem/index.vue',
  'src/components/contentGoods/index.vue',
  'src/views/detail/modules/Tabbar.vue',
  'src/views/detail/modules/Swiper.vue',
  'src/views/cart/modules/Tabbar.vue',
  'src/views/cart/modules/Item.vue',
  'src/views/diamondGoodsList/index.vue',
  'src/views/product/index.vue',
  'src/components/Tabbar/index.vue',
  'src/views/auth/registry.vue'
];

replaceFiles(files);

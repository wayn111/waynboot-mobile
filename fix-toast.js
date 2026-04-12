const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const dirs = ['src/views', 'src/components'];

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.vue')) {
      let content = fs.readFileSync(fullPath, 'utf-8');
      let changed = false;

      if (content.includes('this.$toast')) {
        content = content.replace(/this\.\$toast\.success/g, "showToast({ type: 'success', message: ");
        content = content.replace(/this\.\$toast\.fail/g, "showToast({ type: 'fail', message: ");
        content = content.replace(/this\.\$toast\.loading/g, "showToast({ type: 'loading', ");
        content = content.replace(/this\.\$toast\.clear\(\)/g, "closeToast()");
        content = content.replace(/this\.\$toast\(/g, "showToast(");
        
        // Ensure showToast and closeToast are imported
        if (!content.includes('showToast')) {
          content = content.replace(/<script setup>/, "<script setup>\nimport { showToast, closeToast } from 'vant'");
        } else if (!content.includes('closeToast') && content.includes('closeToast()')) {
          content = content.replace(/import \{.*?\} from 'vant'/, (match) => {
            if (!match.includes('closeToast')) return match.replace('{', '{ closeToast,');
            return match;
          });
        }
        changed = true;
      }

      if (content.includes('this.$dialog')) {
        content = content.replace(/this\.\$dialog\.confirm/g, "showConfirmDialog");
        content = content.replace(/this\.\$dialog\.alert/g, "showDialog");
        
        if (!content.includes('showConfirmDialog') && content.includes('showConfirmDialog')) {
          if (content.includes("from 'vant'")) {
             content = content.replace(/import \{.*?\} from 'vant'/, (match) => {
               if (!match.includes('showConfirmDialog')) return match.replace('{', '{ showConfirmDialog,');
               return match;
             });
          } else {
             content = content.replace(/<script setup>/, "<script setup>\nimport { showConfirmDialog, showDialog } from 'vant'");
          }
        }
        changed = true;
      }
      
      // Some cases might have closing parentheses missing for message: '...' })
      // For instance: this.$toast.success('删除成功') -> showToast({ type: 'success', message: ('删除成功')
      // Wait, the regex `showToast({ type: 'success', message: ` will result in `showToast({ type: 'success', message: ('删除成功')` which is valid JS but missing `})`.
      // Let's use a better replace:
      // this.$toast.success('xxx') -> showToast({ type: 'success', message: 'xxx' })
      // this.$toast.fail('xxx') -> showToast({ type: 'fail', message: 'xxx' })
      // actually, let's fix the above regex.
    }
  }
}

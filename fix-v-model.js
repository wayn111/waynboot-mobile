const fs = require('fs')
const path = require('path')

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f)
    let isDirectory = fs.statSync(dirPath).isDirectory()
    isDirectory ? 
      walkDir(dirPath, callback) : callback(path.join(dir, f))
  })
}

walkDir(path.join(__dirname, 'src'), function(filePath) {
  if (filePath.endsWith('.vue')) {
    let content = fs.readFileSync(filePath, 'utf8')
    let newContent = content.replace(/<van-popup([^>]*?)\bv-model="([^"]+)"/g, '<van-popup$1v-model:show="$2"')
    newContent = newContent.replace(/<van-dialog([^>]*?)\bv-model="([^"]+)"/g, '<van-dialog$1v-model:show="$2"')
    newContent = newContent.replace(/<van-share-sheet([^>]*?)\bv-model="([^"]+)"/g, '<van-share-sheet$1v-model:show="$2"')
    newContent = newContent.replace(/<van-action-sheet([^>]*?)\bv-model="([^"]+)"/g, '<van-action-sheet$1v-model:show="$2"')
    
    // Also vue 3 `.sync` modifier removal
    newContent = newContent.replace(/:([a-zA-Z-]+)\.sync="([^"]+)"/g, 'v-model:$1="$2"')

    // Vue 3 removed v-on.native
    newContent = newContent.replace(/@([a-zA-Z-]+)\.native="([^"]+)"/g, '@$1="$2"')

    if (newContent !== content) {
      fs.writeFileSync(filePath, newContent)
      console.log('Updated v-model/sync in', filePath)
    }
  }
})

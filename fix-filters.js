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
    let newContent = content.replace(/\{\{\s*(.+?)\s*\|\s*yuan\s*\}\}/g, '{{ yuan($1) }}')
    newContent = newContent.replace(/\{\{\s*(.+?)\s*\|\s*dateFormat\s*\}\}/g, '{{ dateFormat($1) }}')
    if (newContent !== content) {
      fs.writeFileSync(filePath, newContent)
      console.log('Updated', filePath)
    }
  }
})

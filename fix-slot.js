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
    let newContent = content.replace(/<([a-zA-Z0-9-]+)([^>]*?)\bslot="([^"]+)"([^>]*)>/g, '<template v-slot:$3><$1$2$4></$1></template>')
    // Wait, replacing a tag with a template wrapping it works for named slots, but the tag's closing tag must also be updated!
    // A simpler approach is to replace `<template slot="name">` with `<template #name>`
    newContent = content.replace(/<template([^>]*?)\bslot="([^"]+)"([^>]*)>/g, '<template$1#$2$3>')
    
    if (newContent !== content) {
      fs.writeFileSync(filePath, newContent)
      console.log('Updated slot= in', filePath)
    }
  }
})

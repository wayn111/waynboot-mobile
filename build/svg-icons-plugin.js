import fs from 'node:fs'
import path from 'node:path'

const virtualModuleId = 'virtual:svg-icons-register'
const resolvedVirtualModuleId = `\0${virtualModuleId}`

const stripSvgShell = (source) => {
  return source
    .replace(/<\?xml[\s\S]*?\?>/g, '')
    .replace(/<!DOCTYPE[\s\S]*?>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .trim()
}

const createSymbol = (filePath, symbolId) => {
  const source = stripSvgShell(fs.readFileSync(filePath, 'utf-8'))
  const viewBox = source.match(/viewBox="([^"]+)"/)?.[1] || '0 0 1024 1024'
  const body = source
    .replace(/<svg\b[^>]*>/i, '')
    .replace(/<\/svg>/i, '')
    .trim()

  return `<symbol id="${symbolId}" viewBox="${viewBox}">${body}</symbol>`
}

const collectSvgFiles = (dir) => {
  if (!fs.existsSync(dir)) {
    return []
  }

  return fs
    .readdirSync(dir, { withFileTypes: true })
    .flatMap((entry) => {
      const fullPath = path.join(dir, entry.name)

      if (entry.isDirectory()) {
        return collectSvgFiles(fullPath)
      }

      return entry.isFile() && entry.name.endsWith('.svg') ? [fullPath] : []
    })
}

const createSprite = (iconDirs, symbolId) => {
  const symbols = iconDirs
    .flatMap((dir) => collectSvgFiles(dir))
    .map((filePath) => {
      const name = path.basename(filePath, '.svg')
      return createSymbol(filePath, symbolId.replace('[name]', name))
    })
    .join('')

  return `<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style="position:absolute;width:0;height:0;overflow:hidden">${symbols}</svg>`
}

export const createSvgIconsPlugin = ({ iconDirs, symbolId = 'icon-[name]' }) => {
  return {
    name: 'local-svg-icons',
    resolveId(id) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId
      }

      return null
    },
    load(id) {
      if (id !== resolvedVirtualModuleId) {
        return null
      }

      const sprite = createSprite(iconDirs, symbolId)

      return `
const sprite = ${JSON.stringify(sprite)}
if (typeof document !== 'undefined' && !document.getElementById('__svg_icons__')) {
  const container = document.createElement('div')
  container.innerHTML = sprite
  const svg = container.firstElementChild
  if (svg) {
    svg.id = '__svg_icons__'
    document.body.insertBefore(svg, document.body.firstChild)
  }
}
`
    },
  }
}

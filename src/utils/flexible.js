const BASE_WIDTH = 750
const ROOT_DIVISOR = 10

const refreshRootFontSize = () => {
  const docEl = document.documentElement
  const width = Math.min(docEl.clientWidth || window.innerWidth || BASE_WIDTH, BASE_WIDTH)
  docEl.style.fontSize = `${width / ROOT_DIVISOR}px`
}

refreshRootFontSize()
window.addEventListener('resize', refreshRootFontSize)
window.addEventListener('pageshow', (event) => {
  if (event.persisted) {
    refreshRootFontSize()
  }
})

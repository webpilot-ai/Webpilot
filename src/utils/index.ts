export function getOS() {
  const {userAgent, platform} = global.navigator
  const macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K']
  const windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE']
  const iosPlatforms = ['iPhone', 'iPad', 'iPod']

  let os = null

  if (macosPlatforms.indexOf(platform) !== -1) {
    os = 'Mac OS'
  } else if (iosPlatforms.indexOf(platform) !== -1) {
    os = 'iOS'
  } else if (windowsPlatforms.indexOf(platform) !== -1) {
    os = 'Windows'
  } else if (/Android/.test(userAgent)) {
    os = 'Android'
  } else if (!os && /Linux/.test(platform)) {
    os = 'Linux'
  }

  return os
}

export function formatShortcut(keys) {
  let keyList = keys

  keyList = keyList.map(item => {
    if (item === 'Control') return 'Ctrl'
    if (item === 'Meta') return 'Cmd'
    // if (item === 'Meta') return '⌘'
    return item.length === 1 ? item.toUpperCase() : item
  })

  return keyList.join(' + ')
}

export function getRectFromInputAndTextarea(target) {
  const {selectionEnd, selectionStart} = target

  const cloneElement = document.createElement('span')

  const {top, left} = target.getBoundingClientRect()

  const style = window.getComputedStyle(target)
  cloneElement.textContent = target.value
  cloneElement.style.whiteSpace = 'pre-wrap'
  cloneElement.style.visibility = 'hidden'
  cloneElement.style.position = 'fixed'
  cloneElement.style.top = `${top}px`
  cloneElement.style.left = `${left}px`
  cloneElement.style.width = style.width
  cloneElement.style.height = style.height
  cloneElement.style.margin = style.margin
  cloneElement.style.padding = style.padding
  cloneElement.style.fontFamily = style.fontFamily
  cloneElement.style.fontSize = style.fontSize
  cloneElement.style.lineHeight = style.lineHeight
  cloneElement.style.fontWeight = style.fontWeight
  cloneElement.style.borderTop = style.borderTop
  cloneElement.style.borderLeft = style.borderLeft
  cloneElement.style.borderRight = style.borderRight
  cloneElement.style.borderBottom = style.borderBottom
  cloneElement.style.backgroundColor = 'white'

  // add to document
  document.body.appendChild(cloneElement)

  // set selection content on cloneelement
  const range = new Range()
  range.setStart(cloneElement.firstChild, selectionStart)
  range.setEnd(cloneElement.firstChild, selectionEnd)

  const selection = window.getSelection()
  selection.removeAllRanges()
  selection.addRange(range)

  // get rect
  const rect = selection.getRangeAt(0).getBoundingClientRect()

  // remove clone elemnt
  document.body.removeChild(cloneElement)

  // recovery textarear or input selection
  target.setSelectionRange(selectionStart, selectionEnd)

  return rect
}

export function getAllScrollableParents(element) {
  const scrollableElemetns = []

  let tempElement = element
  while (tempElement) {
    const {scrollHeight, clientHeight} = tempElement
    const {overflowY} = window.getComputedStyle(tempElement)

    if (scrollHeight > clientHeight && overflowY !== 'hidden') {
      // scroll event not works on HTML tag, replace it with window
      scrollableElemetns.push(tempElement.tagName === 'HTML' ? window : tempElement)
    }
    tempElement = tempElement?.parentElement
  }

  return scrollableElemetns
}

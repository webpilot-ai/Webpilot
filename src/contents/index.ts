import browserSelectedText from 'browser-selected-text'
export const config = {
  matches: ['*://*/*'],
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  const selectedText = browserSelectedText()
  sendResponse(selectedText)
})

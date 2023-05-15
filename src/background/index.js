/** Open init page after install */
chrome.runtime.onInstalled.addListener(event => {
  const initPageUrl = chrome.runtime.getURL('./tabs/index.html')
  if (event.reason === chrome.runtime.OnInstalledReason.INSTALL) {
    chrome.tabs.create({url: initPageUrl})
  }
})

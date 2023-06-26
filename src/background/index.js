/** Open init page after install */
chrome.runtime.onInstalled.addListener(event => {
  const signURL = 'http://localhost/'
  // const signURL = 'https://account.webpilot.ai/'

  // if (event.reason === chrome.runtime.OnInstalledReason.INSTALL) {
  if (event.reason === chrome.runtime.OnInstalledReason.UPDATE) {
    chrome.tabs.create({url: signURL})
  }
})

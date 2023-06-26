/** Open init page after install */
chrome.runtime.onInstalled.addListener(event => {
  // const signURL = 'http://localhost/'
  const signURL = 'https://account.webpilot.ai/'

  if (
    event.reason === chrome.runtime.OnInstalledReason.INSTALL ||
    event.reason === chrome.runtime.OnInstalledReason.UPDATE
  ) {
    // if (event.reason === chrome.runtime.OnInstalledReason.) {
    chrome.tabs.create({url: signURL})
  }
})

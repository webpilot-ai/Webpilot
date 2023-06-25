import {Storage} from '@plasmohq/storage'

export const NEW_TAB_ID = 'NEW_TAB_ID'

/** Open init page after install */
chrome.runtime.onInstalled.addListener(event => {
  const signURL = 'http://localhost/'
  // const signURL = 'https://account.webpilot.ai/'
  const storage = new Storage()

  // if (event.reason === chrome.runtime.OnInstalledReason.INSTALL) {
  if (event.reason === chrome.runtime.OnInstalledReason.UPDATE) {
    chrome.tabs.create({url: signURL}, tab => {
      const tabId = tab.id

      storage.set(NEW_TAB_ID, tabId)
    })
  }
})

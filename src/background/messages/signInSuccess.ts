import {Storage} from '@plasmohq/storage'

import {GOOGLE_CREDENTIAL} from '@/apiConfig'

const extensionURL = chrome.runtime.getURL('./tabs/index.html')

const getCurrentTabId = async () => {
  const queryOptions = {
    active: true,
    lastFocusedWindow: true,
    url: ['https://account.webpilot.ai/*', 'http://localhost/*'],
  }
  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  const [tab] = await chrome.tabs.query(queryOptions)
  return tab?.id
}

const handler = async req => {
  const storage = new Storage()
  const tabId = await getCurrentTabId()

  if (tabId) {
    chrome.tabs.update({url: extensionURL})
  }

  const {credential} = req.body
  storage.set(GOOGLE_CREDENTIAL, credential)
}

export default handler

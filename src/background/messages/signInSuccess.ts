import {Storage} from '@plasmohq/storage'

import {GOOGLE_CREDENTIAL} from '@/apiConfig'

import {NEW_TAB_ID} from '../index'

const extensionURL = chrome.runtime.getURL('./tabs/index.html')

const handler = async req => {
  const storage = new Storage()
  const tabId = await storage.get(NEW_TAB_ID)

  chrome.tabs.update(tabId, {url: extensionURL})
  storage.remove(NEW_TAB_ID)

  const {credential} = req.body
  storage.set(GOOGLE_CREDENTIAL, credential)
}

export default handler

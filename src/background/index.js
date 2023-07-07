import {sendToContentScript} from '@plasmohq/messaging'
import {Storage} from '@plasmohq/storage'

import {MESSAGING_EVENT, WEBPILOT_CONFIG_STORAGE_KEY} from '@/config'

/** Open init page after install */
chrome.runtime.onInstalled.addListener(event => {
  // const signURL = 'http://localhost/'
  const signURL = 'https://account.webpilot.ai/'

  if (
    event.reason === chrome.runtime.OnInstalledReason.INSTALL
    // event.reason === chrome.runtime.OnInstalledReason.UPDATE
  ) {
    chrome.tabs.create({url: signURL})
  }
})

const storage = new Storage()
const swtichPopup = url => {
  if (!url) {
    return
  }

  if (url.startsWith('chrome:') || url.startsWith('chrome-extension:')) {
    chrome.action.setPopup({popup: 'popup.html'})
  } else {
    chrome.action.setPopup({popup: ''})
  }
}

chrome.tabs.onActivated.addListener(({tabId}) => {
  chrome.tabs.get(tabId, tab => {
    swtichPopup(tab?.url)
  })
})
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo) => {
  swtichPopup(changeInfo.url)

  const reloadTabId = await storage.get('RELOAD_TAB_ID')
  if (reloadTabId && changeInfo.status === 'complete') {
    openWidget()
    storage.remove('RELOAD_TAB_ID')
  }
})

// const openPopup = () => {
//   const {origin} = window.location
//   window.postMessage('OPEN_POPUP', origin)
// }

const openWidget = async () => {
  await sendToContentScript({
    name: MESSAGING_EVENT.SHOW_POPUP,
  })
}

const popupHandler = async tab => {
  const config = await storage.get(WEBPILOT_CONFIG_STORAGE_KEY)

  if (!config || !config.isFinishSetup || !config.isAuth) {
    // const [tab] = await chrome.tabs.query({
    //   active: true,
    //   currentWindow: true,
    // })

    const currentUrl = tab?.url
    // can't get current open page url
    if (currentUrl === undefined) return

    const signURL = 'https://account.webpilot.ai/'
    const welcomeUrl = chrome?.runtime?.getURL('tabs/index.html')

    // aready in welcome page
    if (currentUrl === signURL || currentUrl === welcomeUrl) {
      return
    }

    chrome.tabs.create({url: signURL})
  } else {
    try {
      await openWidget()
    } catch (error) {
      await storage.set('RELOAD_TAB_ID', tab.id)
      chrome.tabs.reload(tab.id)
    }
  }

  // chrome.scripting.executeScript({
  //   target: {tabId: tab.id},
  //   func: openPopup,
  // })
}

chrome.action.onClicked.addListener(popupHandler)

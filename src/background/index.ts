import {sendToContentScript} from '@plasmohq/messaging'

import {MESSAGING_EVENT} from '@/config'

chrome.action.onClicked.addListener(() => {
  sendToContentScript({
    name: MESSAGING_EVENT.EXTNEION_ICON_CLICK,
  })
})

export {}

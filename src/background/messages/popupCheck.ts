import {sendToContentScript} from '@plasmohq/messaging'

import {MESSAGING_EVENT} from '@/config'

const handler = async (req, res) => {
  const queryOptions = {active: true, currentWindow: true}
  const [tab] = await chrome.tabs.query(queryOptions)
  const url = tab?.url

  let keepPopupOpen = true

  if (url) {
    keepPopupOpen = url.startsWith('chrome:') || url.startsWith('chrome-extension:')
  }

  res.send(keepPopupOpen)

  if (!keepPopupOpen) {
    sendToContentScript({
      name: MESSAGING_EVENT.SHOW_POPUP,
    })
  }
}

export default handler

import {sendToBackground} from '@plasmohq/messaging'

export const config = {
  matches: ['https://account.webpilot.ai/*', 'http://localhost/*', 'https://openai.com/*'],
}

const handleMessage = event => {
  if (event.source === window && event.data && event.data.credential) {
    // Send the message to the background script
    sendToBackground({
      name: 'signInSuccess',
      body: {
        credential: event.data.credential,
      },
    })
    // chrome.runtime.sendMessage({credential: event.data.credential})
  }
}

window.addEventListener('message', handleMessage)

export const config = {
  matches: ['https://account.webpilot.ai/*', 'https://locaolhost/*', 'https://openai.com/*'],
}

const handleMessage = event => {
  if (event.source === window && event.data && event.data.credential) {
    // Send the message to the background script
    chrome.runtime.sendMessage({credential: event.data.credential}, function () {})
  }
}

window.addEventListener('message', handleMessage)

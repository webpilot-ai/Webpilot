// Listen for messages from the webpage
window.addEventListener('message', function (event) {
  console.log('send credential to extension ', event)
  if (event.source === window && event.data && event.data.credential) {
    // Send the message to the background script
    chrome.runtime.sendMessage({credential: event.data.credential}, function () {})
  }
})

// Listen for messages from the webpage
window.addEventListener('message', function (event) {
  if (event.source === window && event.data && event.data.username) {
    // Send the message to the background script
    chrome.runtime.sendMessage({username: event.data.username}, function (response) {
      console.log(response.message)
    })
  }
})

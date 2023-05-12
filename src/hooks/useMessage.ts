import {onMounted, onUnmounted} from 'vue'

export default function useMessage(handler) {
  const metaListener = async (req, sender, sendResponse) => {
    await handler?.(
      {
        ...req,
        sender,
      },
      {
        send: p => sendResponse(p),
      }
    )
  }

  onMounted(() => {
    chrome.runtime.onMessage.addListener(metaListener)
  })

  onUnmounted(() => {
    chrome.runtime.onMessage.removeListener(metaListener)
  })
}

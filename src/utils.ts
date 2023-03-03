import {toast as rowToast} from 'react-toastify'
import {MESSAGING_EVENT} from '@/config'

const toastConfig = {
  position: 'top-center',
  style: {width: '80%', margin: '125px auto'},
  autoClose: 1000,
  hideProgressBar: true,
  closeOnClick: false,
  pauseOnHover: false,
  draggable: false,
  progress: undefined,
  theme: 'light',
}

export async function getSelectedText() {
  const tab = await getActiveTab()
  const message = {event: MESSAGING_EVENT.GET_SELECTED_TEXT}

  return new Promise((resolve, reject) => {
    chrome.tabs.sendMessage(tab.id, message, selectedText => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError)
      } else {
        resolve(selectedText)
      }
    })
  })
}

export function toast(text, config = {}) {
  rowToast(text, {
    ...toastConfig,
    ...config,
  })
}

toast.info = (text, config = {}) => {
  rowToast.info(text, {...toastConfig, ...config})
}

toast.warn = (text, config = {}) => {
  rowToast.warn(text, {...toastConfig, ...config})
}

toast.success = (text, config = {}) => {
  rowToast.success(text, {...toastConfig, ...config})
}

toast.error = (text, config = {}) => {
  rowToast.error(text, {...toastConfig, ...config})
}

export function navToOptions() {
  if (chrome.runtime.openOptionsPage) {
    chrome.runtime.openOptionsPage()
  } else {
    window.open(chrome.runtime.getURL('options.html'))
  }
}

export async function getActiveTab() {
  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  })
  return tab
}

export function gettext(text) {
  let res = ''
  try {
    const key = text.replace(/[^A-Za-z0-9_]/g, '_')
    res = chrome.i18n.getMessage(key) || text
  } catch (e) {
    res = text
  }

  return res
}

export function noop() {
  return null
}

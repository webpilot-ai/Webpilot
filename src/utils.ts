import {toast as rowToast} from 'react-toastify'

const toastConfig = {
  position: 'top-center',
  style: {width: '80%', margin: '125px auto'},
  autoClose: 1000, // ms
  limit: 1,
  hideProgressBar: true,
  closeOnClick: false,
  pauseOnHover: false,
  draggable: false,
  progress: undefined,
  theme: 'light',
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
  rowToast.success(text, {...toastConfig, autoClose: 4000, ...config})
}

toast.error = (text, config = {}) => {
  rowToast.error(text, {...toastConfig, autoClose: 4000, ...config})
}

export function navToOptions() {
  const {openOptionsPage, getURL} = chrome?.runtime

  if (openOptionsPage) {
    openOptionsPage()
  } else {
    window.open(getURL('options.html'))
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

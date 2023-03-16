import {toast as rowToast} from 'react-toastify'

export function getSelectedText() {
  let selected = ''

  if (window.getSelection) {
    selected = window.getSelection().toString()
  } else if (document.selection) {
    selected = document.selection?.createRange().text
  }

  if (selected === '') {
    const activeElement = document.activeElement
    if (!activeElement) return selected

    if (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA') {
      const el = activeElement
      selected = el.value.slice(el.selectionStart || 0, el.selectionEnd || 0)
    } else if (activeElement.tagName === 'IFRAME') {
      const contentWindow = activeElement.contentWindow

      if (contentWindow.getSelection) {
        selected = contentWindow.getSelection().toString() || ''
      }
    }
  }

  return selected.toString().trim() || ''
}

export function navToOptions() {
  const {openOptionsPage, getURL} = chrome?.runtime

  if (openOptionsPage) {
    openOptionsPage()
  } else {
    window.open(getURL('options.html'))
  }
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

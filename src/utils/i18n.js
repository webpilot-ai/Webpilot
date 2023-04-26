export function $gettext(text) {
  let res = ''
  try {
    const key = text.replace(/[^A-Za-z0-9_]/g, '_')
    res = chrome.i18n.getMessage(key) || text
  } catch (e) {
    res = text
  }

  return res
}

export const i18nPlugin = {
  install(app) {
    /* eslint-disable no-param-reassign */
    app.config.globalProperties.$gettext = $gettext
  },
}

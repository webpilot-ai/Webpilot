<script>
import '@/featureFlagsConfig'

import {createApp} from 'vue'
import {createPinia} from 'pinia'

import {i18nPlugin} from '@/utils/i18n'

import App from '@/csui/Index/TheEntry.vue'
import useStore from '@/stores/store'
import 'vue-toast-notification/dist/theme-bootstrap.css'

export default {
  plasmo: {render, getRootContainer},
}

export const config = {
  matches: ['<all_urls>'],
}

async function render({createRootContainer}) {
  const rootElement = await createRootContainer()
  const shadowElement = rootElement.attachShadow({mode: 'open'})
  const templateElement = document.createElement('div')
  templateElement.setAttribute('id', 'webpilot-template')
  shadowElement.append(templateElement)

  const pinia = createPinia()
  const app = createApp(App)

  app.use(i18nPlugin)
  app.use(pinia)

  // init pinia data
  const store = useStore()
  await store.initConfig()
  app.mount(templateElement)

  // inject styles
  insertStylesheet(shadowElement)
}

async function getRootContainer() {
  const [$html] = document.getElementsByTagName('html')

  if (!$html) return null

  const $rootContainer = document.createElement('div')
  $rootContainer.setAttribute('id', 'webpilot-container')
  $html.append($rootContainer)
  return $rootContainer
}

async function insertStylesheet(parentElement) {
  const config = await (await fetch(chrome.runtime.getURL('manifest.json'))).json()
  if (!config.content_scripts && !config.content_scripts.length) return
  const tasks = []
  config.content_scripts.forEach(item => {
    if (!item.matches[0] || item.matches[0] !== '<all_urls>') return
    item.css.forEach(name => {
      if (!/^Index\.\w+\.css$/.test(name)) return
      tasks.push(fetch(chrome.runtime.getURL(name)).then(v => v.text()))
    })
  })
  const files = await Promise.all(tasks)
  files.forEach(themes => {
    const childElement = document.createElement('style')
    childElement.textContent = themes
    parentElement.insertBefore(childElement, parentElement.firstChild)
  })
}
</script>

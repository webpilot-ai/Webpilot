<script>
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
  const rootContainer = await createRootContainer()

  const pinia = createPinia()
  const app = createApp(App)

  app.use(i18nPlugin)
  app.use(pinia)

  // init pinia data
  const store = useStore()
  await store.initConfig()

  app.mount(rootContainer)
}

async function getRootContainer() {
  const [$html] = document.getElementsByTagName('html')

  if (!$html) return null

  const $rootContainer = document.createElement('div')
  $rootContainer.setAttribute('id', 'webpilot-container')
  $html.append($rootContainer)
  return $rootContainer
}
</script>

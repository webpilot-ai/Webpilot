<script>
import {createApp} from 'vue'

import App from '@/csui/Index/TheEntry.vue'

export default {
  plasmo: {render, getRootContainer},
}

export const config = {
  matches: ['<all_urls>'],
}

async function render({createRootContainer}) {
  const rootContainer = await createRootContainer()

  const app = createApp(App)
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

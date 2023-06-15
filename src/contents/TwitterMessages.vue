<script>
import {createApp} from 'vue'
import {createPinia} from 'pinia'

import TheEntry from '@/csui/TwitterMessages/TheEntry.vue'
import useStore from '@/stores/store'

export default {
  plasmo: {render, getRootContainer},
}

export const config = {
  matches: ['https://www.askjhdjksj.xmn/'],
  // matches: ['https://twitter.com/*'],
}

async function render({createRootContainer}) {
  const rootContainer = await createRootContainer()
  const pinia = createPinia()

  const app = createApp(TheEntry)

  app.use(pinia)

  // init pinia data
  const store = useStore()
  await store.initConfig()

  app.mount(rootContainer)
}

async function getRootContainer() {
  const [$html] = document.getElementsByTagName('html')
  console.log($html, 'html')

  if (!$html) return null

  const $rootContainer = document.createElement('div')
  $html.append($rootContainer)

  return $rootContainer
}
</script>

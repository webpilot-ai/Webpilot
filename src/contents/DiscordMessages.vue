<script>
import {createApp} from 'vue'
import {createPinia} from 'pinia'

import TheEntry from '@/csui/DiscordMessages/TheEntry.vue'
import useStore from '@/stores/store'

export default {
  plasmo: {render, getRootContainer},
}

export const config = {
  matches: ['https://discord.com/*', 'https://discord.com/channels/*/*'],
}

async function render({createRootContainer}) {
  console.log('render');
  const rootContainer = await createRootContainer()
  const pinia = createPinia()

  const app = createApp(TheEntry)

  app.use(pinia)

  // init pinia data
  const store = useStore()
  await store.initConfig()
  console.log('config initialized');

  app.mount(rootContainer)
  console.log('app mounted');
}

async function getRootContainer() {
  console.log('getting root container');
  const [$html] = document.getElementsByTagName('html')
  console.log('html', $html);

  if (!$html) return null

  const $rootContainer = document.createElement('div')
  $html.append($rootContainer)
  console.log('root container created');

  return $rootContainer
}
</script>
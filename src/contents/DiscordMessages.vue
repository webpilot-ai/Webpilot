<template>
  <div :class="$style.container">
    <TheEntry></TheEntry>
  </div>
</template>

<script>
import {createPinia} from 'pinia'

import useStore from '@/stores/store'
import TheEntry from '@/csui/DiscordMessages/TheEntry.vue'

export const config = {
  matches: ['https://www.askjhdjksj.xmn/'],
  // matches: ['http://localhost/*'],
  // matches: ['https://discord.com/channels/662267976984297473/*'],
}

const getRootContainer = async () => {
  return new Promise(resolve => {
    const checkInterval = setInterval(() => {
      const element = document.querySelector('form')

      if (element) {
        // const parent = element.parentNode
        // if (parent) {
        //   // parent.setAttribute('style', 'overflow-y: initial;')
        // }

        clearInterval(checkInterval)
        resolve(element)
      }
    }, 200)
  })
}

export default {
  plasmo: {
    getRootContainer,
  },
  components: {
    TheEntry,
  },
  setup() {},
  data() {},
  beforeCreate() {
    const pinia = createPinia()

    this.app.use(pinia)

    const store = useStore()
    store.initConfig()
  },
  mounted() {},
}
</script>

<style lang="scss" module>
.container {
  position: absolute;
  right: 13px;
  bottom: 76px;
  z-index: 99999999;
}
</style>

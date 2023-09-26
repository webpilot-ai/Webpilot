<template>
  <div ref="root" :class="$style.container">
    <TheEntry></TheEntry>
  </div>
</template>

<script>
import {createPinia} from 'pinia'

import useStore from '@/stores/store'
import TheEntry from '@/csui/SlackMessages/TheEntry.vue'

export const config = {
  // matches: ['http://localhost/*'],
  matches: ['https://app.slack.com/client/*'],
}

const getRootContainer = async () => {
  return new Promise(resolve => {
    const checkInterval = setInterval(() => {
      const element = document.querySelector('.c-wysiwyg_container__formatting')

      if (element) {
        clearInterval(checkInterval)
        resolve(element)
      }
    }, 500)
  })
}

export default {
  plasmo: {
    getRootContainer,
  },
  components: {
    TheEntry,
  },
  beforeCreate() {
    const pinia = createPinia()

    this.app.use(pinia)

    const store = useStore()
    store.initConfig()
  },
}
</script>

<style lang="scss" module>
.container {
  position: absolute;
  right: 8px;
  bottom: 4px;
  z-index: 99999999;
}
</style>

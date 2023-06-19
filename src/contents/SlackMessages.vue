<template>
  <div :class="$style.container">
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
      const element = document.querySelector('.ql-editor')

      if (element) {
        const parent = element.parentNode
        if (parent) {
          // parent.setAttribute('style', 'overflow-y: initial;')
        }

        clearInterval(checkInterval)
        resolve(parent)
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
  right: 8px;
  bottom: 46px;
  z-index: 99999999;
}
</style>

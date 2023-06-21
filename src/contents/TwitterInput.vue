<template>
  <div :class="$style.container">
    <!-- <span style="color: red">{{ count }}</span> -->
    <!-- <button @click="count++">Many Myths are based on truth</button> -->
    <TheEntry></TheEntry>
  </div>
</template>

<script>
import {createPinia} from 'pinia'

import useStore from '@/stores/store'
import TheEntry from '@/csui/TwitterInput/TheEntry.vue'

export const config = {
  matches: ['https://www.askjhdjksj.xmn/'],
  // matches: ['http://localhost/*'],
  // matches: ['https://twitter.com/*', 'http://localhost/*'],
}

// const getInlineAnchor = () =>
//   document.querySelector('.DraftEditor-root') || document.querySelector('#ul')

// const mountShadowHost = ({anchor, shadowHost}) => {
//   if (anchor.element.parentNode) {
//     const parent = anchor.element.parentNode
//     parent.appendChild(shadowHost)
//     parent.setAttribute('style', 'overflow-y: inherit;')
//   }
// }
// const getShadowHostId = () => 'webpilot-super-button'
// const getStyle = () => {
//   const style = document.createElement('style')
//   style.textContent = `
//     #plasmo-shadow-container {
//       background-color: yellow;
//       position: absolute!important;
//       top: 0;
//       right: 0;
//       width: 100%;
//     }
//   `
//   return style
// }

const getRootContainer = async () => {
  return new Promise(resolve => {
    const checkInterval = setInterval(() => {
      const element = document.querySelector('.DraftEditor-root')

      if (element) {
        const parent = element.parentNode
        if (parent) {
          parent.setAttribute('style', 'overflow-y: initial;')
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
    // getInlineAnchor,
    // mountShadowHost,
    // getShadowHostId,
    // getStyle,
  },
  components: {
    TheEntry,
  },
  setup() {},
  data() {},
  beforeCreate() {
    const pinia = createPinia()

    this.app.use(pinia)

    // init pinia data
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
  bottom: -10px;
  z-index: 99999999;
}
</style>

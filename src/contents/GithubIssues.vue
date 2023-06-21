<template>
  <div ref="root" :class="$style.container">
    <TheEntry></TheEntry>
  </div>
</template>

<script>
import '@/featureFlagsConfig'

import {createPinia} from 'pinia'

import useStore from '@/stores/store'
import TheEntry from '@/csui/GithubIssues/TheEntry.vue'

export const config = {
  // matches: ['http://localhost/*'],
  matches: ['https://github.com/*/issues', 'https://github.com/*/issues/*'],
}

let isRender = false

const getRootContainer = async () => {
  return new Promise(resolve => {
    const checkInterval = setInterval(() => {
      const element =
        document.querySelector('#issue_body') || document.querySelector('#new_comment_field')

      if (element) {
        const parent = element.parentNode
        const csuiContainer = document.querySelector('.plasmo-csui-container')

        // first time to new issue, render will run twice
        if (csuiContainer) {
          parent.removeChild(csuiContainer)
        }

        clearInterval(checkInterval)
        resolve(parent)
      }
    }, 500)
  })
}

const watch = ({render}) => {
  const observer = new MutationObserver(() => {
    const element =
      document.querySelector('#issue_body') || document.querySelector('#new_comment_field')

    if (!element) {
      isRender = false
      return
    }

    if (!isRender) {
      isRender = true
      render({
        element: document.documentElement,
        type: 'overlay',
      })
    }
  })

  // Need to watch the subtree for shadowDOM
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  })
}

export default {
  plasmo: {
    getRootContainer,
    watch,
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
  mounted() {},
}
</script>

<style lang="scss" module>
.container {
  position: absolute;
  right: 8px;
  bottom: 8px;
  z-index: 99999999;
}
</style>

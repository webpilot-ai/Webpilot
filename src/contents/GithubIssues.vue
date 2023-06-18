<script>
import '@/featureFlagsConfig'
import {createApp} from 'vue'
import {createPinia} from 'pinia'

import TheEntry from '@/csui/GithubIssues/TheEntry.vue'
import useStore from '@/stores/store'

export default {
  plasmo: {render, getRootContainer, watch},
}

export const config = {
  // matches: ['https://github.com/*/issues/*'],
  // matches: ['https://www.askjhdjksj.xmn/'],
  matches: ['https://github.com/*/issues', 'https://github.com/*/issues/*'],
}

let isRender = false

async function render({createRootContainer}) {
  if (isRender || document.getElementById('webpilot-superbutton')) {
    isRender = true
    return
  }
  isRender = true

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
  return new Promise(resolve => {
    const checkInterval = setInterval(() => {
      const $textarea =
        document.querySelector('#issue_body') || document.querySelector('#new_comment_field')

      if ($textarea) {
        const $parent = $textarea.parentNode
        const $rootContainer = document.createElement('div')

        $parent.setAttribute('style', 'position:relative;')
        $rootContainer.setAttribute(
          'style',
          'position:absolute;right:8px;bottom:8px;z-index:99999999;'
        )
        $rootContainer.setAttribute('id', 'webpilot-superbutton')
        $parent.insertBefore($rootContainer, $textarea)

        clearInterval(checkInterval)
        resolve($rootContainer)
      }
    }, 200)
  })
}

function watch({render}) {
  const observer = new MutationObserver(() => {
    const $textarea =
      document.querySelector('#issue_body') || document.querySelector('#new_comment_field')

    if (!$textarea) {
      isRender = false
      return
    }

    render({
      createRootContainer: getRootContainer,
    })
  })

  // Need to watch the subtree for shadowDOM
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  })
}

// async function getRootContainer() {
//   let $textarea = document.querySelector('#issue_body')
//   if (!$textarea) $textarea = document.querySelector('#new_comment_field')

//   const $parent = $textarea.parentNode
//   const $rootContainer = document.createElement('div')

//   $parent.setAttribute('style', 'position:relative;')
//   $rootContainer.setAttribute('style', 'position:absolute;right:16px;bottom:16px;z-index:99999999;')

//   $parent.insertBefore($rootContainer, $textarea)
//   return $rootContainer
// }
</script>

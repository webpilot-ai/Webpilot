<script setup>
import '@assets/styles/csui-reset.scss'

import {ref, watch} from 'vue'

import {useActiveElement} from '@vueuse/core'

import SuperButton from '@/components/SuperButton/SuperButton.vue'

import useAskAi from '@/hooks/useAskAi'
import useSuperButtonPrompt from '@/hooks/useSuperButtonPrompt'

const STORAGE_KEY = 'TwitterMessage'
const TITLE = 'twitter.com'

const refSuperButton = ref(null)
const isInitialized = ref(false)
const superButtonTitle = ref(TITLE)
const DEFAULT_PROMPT = 'Re-write in native American English (within 280 characters)'
const originTextareaValue = ref('')

const {askAi, generating, done, result} = useAskAi()

const {superButtonPrompt, setSuperButtonPrompt} = useSuperButtonPrompt(STORAGE_KEY, DEFAULT_PROMPT)

const activeElement = useActiveElement()

// watch(done, () => {
//   document.execCommand?.('insertText', false, '  ')
//   document.execCommand?.('insertText', false, result.value)
// })

watch(result, result => {
  getEditor().innerText = result
})

// function getTextarea() {
//   let $textarea = document.querySelector('#issue_body')
//   if (!$textarea) $textarea = document.querySelector('#new_comment_field')
//   return $textarea
// }

watch(activeElement, el => {
  if (!el.classList.contains('public-DraftEditor-content')) return

  if (generating.value) return
  if (!isInitialized.value) isInitialized.value = true

  const parent = el.parentNode.parentNode
  parent.setAttribute('style', 'position: relative')
  parent.appendChild(refSuperButton.value)
})

async function handleFire({prompt}) {
  setSuperButtonPrompt(prompt)
  const editor = getEditor()
  const referenceText = editor.innerText

  originTextareaValue.value = referenceText

  await askAi({referenceText, command: prompt})
}

function getEditor() {
  return refSuperButton.value.parentNode.querySelector('.public-DraftEditor-content')
}

async function handleAbort() {
  askAi()
}

function handleUndo() {
  getEditor().innerText = originTextareaValue.value
}
</script>

<template>
  <section v-show="isInitialized" ref="refSuperButton" :class="$style.twitterSuperButton">
    <SuperButton
      :done="done"
      :generating="generating"
      :prompt="superButtonPrompt"
      :title="superButtonTitle"
      @abort="handleAbort"
      @fire="handleFire"
      @undo="handleUndo"
    />
  </section>
</template>

<style lang="scss" module>
.twitterSuperButton {
  position: absolute;
  right: 16px;
  bottom: 2px;
  z-index: 99999999;
}
</style>

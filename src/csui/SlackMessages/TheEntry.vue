<script setup>
import '@assets/styles/csui-reset.scss'

import {ref, watch} from 'vue'

import {useActiveElement} from '@vueuse/core'

import SuperButton from '@/components/SuperButton/SuperButton.vue'

import useAskAi from '@/hooks/useAskAi'
import useSuperButtonPrompt from '@/hooks/useSuperButtonPrompt'

const STORAGE_KEY = 'SlackMessages'
const TITLE = 'slack.com'

const refSuperButton = ref(null)
const superButtonTitle = ref(TITLE)
const originEditorContent = ref('')
const DEFAULT_PROMPT = 'Re-write in native American English'

const {askAi, generating, done, result} = useAskAi()

const {superButtonPrompt, setSuperButtonPrompt} = useSuperButtonPrompt(STORAGE_KEY, DEFAULT_PROMPT)

const activeElement = useActiveElement()

watch(result, result => {
  getEditor().innerText = result
})
watch(activeElement, el => {
  if (!el.classList.contains('ql-editor')) return
  if (generating.value) return

  const grandParent = el.parentNode.parentNode
  grandParent.setAttribute('style', 'position: relative')
  grandParent.appendChild(refSuperButton.value)
})

async function handleFire({prompt}) {
  setSuperButtonPrompt(prompt)
  const editor = getEditor()
  const referenceText = editor.innerText

  originEditorContent.value = editor.innerHTML

  await askAi({referenceText, command: prompt})
}

function getEditor() {
  return refSuperButton.value.parentNode.querySelector('.ql-editor')
}

async function handleAbort() {
  askAi()
}

function handleUndo() {
  getEditor().innerHTML = originEditorContent.value
}
</script>

<template>
  <section ref="refSuperButton" :class="$style.slackSuperButton">
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
.slackSuperButton {
  position: absolute;
  right: 16px;
  bottom: 0;
  z-index: 99999999;
}
</style>

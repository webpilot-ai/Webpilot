<template>
  <SuperButton
    :done="done"
    :generating="generating"
    :prompt="superButtonPrompt"
    :title="superButtonTitle"
    @abort="handleAbort"
    @fire="handleFire"
    @undo="handleUndo"
  />
</template>

<script setup>
import '@assets/styles/csui-reset.scss'

import {ref, watch} from 'vue'

import SuperButton from '@/components/SuperButton/SuperButton.vue'

import useAskAi from '@/hooks/useAskAi'
import useSuperButtonPrompt from '@/hooks/useSuperButtonPrompt'

const STORAGE_KEY = 'TwitterInput'
const TITLE = 'twitter.com'
const DEFAULT_PROMPT = 'Re-write in native American English (within 280 characters)'

const superButtonTitle = ref(TITLE)
const originTextareaValue = ref('')

const {askAi, generating, done, result} = useAskAi()

const {superButtonPrompt, setSuperButtonPrompt} = useSuperButtonPrompt(STORAGE_KEY, DEFAULT_PROMPT)

watch(result, result => {
  getTextarea().innerText = result
})

function getTextarea() {
  const $textarea = document.querySelector('.public-DraftEditor-content')
  return $textarea
}

async function handleFire({prompt}) {
  setSuperButtonPrompt(prompt)
  const referenceText = getTextarea().innerText

  originTextareaValue.value = referenceText

  await askAi({referenceText, command: prompt})
}

async function handleAbort() {
  askAi()
}

function handleUndo() {
  getTextarea().innerText = originTextareaValue.value
}
</script>

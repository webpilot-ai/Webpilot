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

const STORAGE_KEY = 'GithubIssues'
const TITLE = 'github.com'
const DEFAULT_PROMPT = 'Re-write in better English'

const superButtonTitle = ref(TITLE)
const originTextareaValue = ref('')

const {askAi, generating, done, result} = useAskAi()

const {superButtonPrompt, setSuperButtonPrompt} = useSuperButtonPrompt(STORAGE_KEY, DEFAULT_PROMPT)

watch(result, result => {
  getTextarea().value = result
})

function getTextarea() {
  const $textarea =
    document.querySelector('#issue_body') || document.querySelector('#new_comment_field')
  return $textarea
}

async function handleFire({prompt}) {
  setSuperButtonPrompt(prompt)
  const referenceText = getTextarea().value

  originTextareaValue.value = referenceText

  await askAi({referenceText, command: prompt})
}

async function handleAbort() {
  await askAi()
  // after result change, restore the original value
  setTimeout(() => {
    getTextarea().value = originTextareaValue.value
  }, 0)
}

function handleUndo() {
  getTextarea().value = originTextareaValue.value
}
</script>

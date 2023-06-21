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

const STORAGE_KEY = 'DiscordMessages'
const TITLE = 'discord.com'
const DEFAULT_PROMPT = `Let's draw an image about this. You need to write in English without word wraps and headlines, without connection words. back to back separated with commas: [1], [element], [2], [3] {environment}, [4], [5], [6] {style settings}

Replace [1] with the subject "A image of ";

Replace [element] with the sentence you mentioned;

Replace [2] with a list of creative detailed descriptions about [element];

Replace [3] with a list of detailed descriptions about the environment of the scene;

Replace [4] with a list of detailed descriptions about the mood/feelings and atmosphere of the scene;

Replace [5] with a list of specific camera model(including specific color film type and lens details as well as techniques) set a artistic style;

Replace [6] with a list of multiple directors, cinematographers, photographers, fashion designers, cartoonist or artist, who would be unlikely to collaborate but would juxtapose uniquely.

Simply write the without explanation, replace the content inside the brackets with details about the content/word inside the brackets and delete the brackets. Repeat that for every bracket in the prompt, complex prompt for an AI-based text to image program that converts a prompt about a topic into an image. The outcome depends on the prompt's coherence. The topic of the whole scene is always dependent on the subject that is replaced with [element], always start the prompt with "/imagine prompt:", don't use any line breaks, Proper grammar is unnecessary and details can be listed.

Do not show things like "[1]""[element]" in your response.`

const superButtonTitle = ref(TITLE)
const originTextareaValue = ref('')

const {askAi, generating, done, result} = useAskAi()

const {superButtonPrompt, setSuperButtonPrompt} = useSuperButtonPrompt(STORAGE_KEY, DEFAULT_PROMPT)

watch(result, result => {
  getTextarea().innerHTML = `<span data-slate-string="true">${result}</span>`
})

function getTextarea() {
  const $textarea = document.querySelector('[data-slate-leaf="true"]')
  return $textarea
}

async function handleFire({prompt}) {
  setSuperButtonPrompt(prompt)
  const referenceText = getTextarea().innerText

  originTextareaValue.value = getTextarea().innerHTML

  await askAi({referenceText, command: prompt})
}

async function handleAbort() {
  askAi()
}

function handleUndo() {
  getTextarea().innerText = originTextareaValue.value
}
</script>

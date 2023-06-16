<template>
  <section ref="refSuperButton" :class="$style.discordSuperButton">
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

<script setup lang="ts">
import '@assets/styles/csui-reset.scss'
import {ref, watch, nextTick, onMounted} from 'vue'
import {useActiveElement} from '@vueuse/core'

import SuperButton from '@/components/SuperButton/SuperButton.vue'
import useAskAi from '@/hooks/useAskAi'
import useSuperButtonPrompt from '@/hooks/useSuperButtonPrompt'

const STORAGE_KEY = 'DiscordMessages'
const TITLE = 'discord.com'

const refSuperButton = ref(null)
const isInitialized = ref(false)
const superButtonTitle = ref(TITLE)
const DEFAULT_PROMPT =
  "Let's draw a image about this. You need to write in English without word wraps and headlines, without connection words. back to back separated with commas: [1], [element], [2], [3] {environment}, [4], [5], [6] {style settings} Replace [1] with the subject 'A image of '; Replace [element] with the sentence you mentioned; Replace [2] with a list of creative detailed descriptions about [element]; Replace [3] with a list of detailed descriptions about the environment of the scene; Replace [4] with a list of detailed descriptions about the mood/feelings and atmosphere of the scene; Replace [5] with a list of specific camera model(including specific color film type and lens details as well as techniques)  set a artistic style; Replace [6] with a list of multiple directors, cinematographers, photographers, fashion designers, cartoonist or artist, who would be unlikely to collaborate but would juxtapose uniquely. Simply write the without explanation, replace the content inside the brackets with details about the content/word inside the brackets and delete the brackets. Repeat that for every bracket in the prompt, complex prompt for an AI-based text to image program that converts a prompt about a topic into an image. The outcome depends on the prompt's coherence. The topic of the whole scene is always dependent on the subject that is replaced with [element], always start the prompt with '/imagine prompt:', don't use any line breaks, Proper grammar is unnecessary and details can be listed. Do not show things like '[1]''[element]' in your response."

const {askAi, generating, done, result} = useAskAi()
const {superButtonPrompt, setSuperButtonPrompt} = useSuperButtonPrompt(STORAGE_KEY, DEFAULT_PROMPT)

const activeElement = useActiveElement()

watch(done, () => {
  if (done.value) {
    const editor = getEditor()
    if (editor) {
      editor.innerText = result.value
    }
  }
})

watch(activeElement, el => {
  if (el.getAttribute('role') !== 'textbox') return
  if (generating.value) return
  if (!isInitialized.value) isInitialized.value = true
  const parent = el.parentNode
  parent.setAttribute('style', 'position: relative')
  parent.appendChild(refSuperButton.value)
})

async function handleFire({prompt}) {
  setSuperButtonPrompt(prompt)
  const editor = getEditor()
  const referenceText = editor.innerText
  await askAi({referenceText, command: prompt})
  isInitialized.value = false
}

function getEditor() {
  return refSuperButton.value.parentNode.querySelector('[role="textbox"]')
}

function handleUndo() {
  document.execCommand?.('undo', false)
  nextTick(() => {
    document.execCommand?.('insertText', false, '')
  })
  isInitialized.value = false
}

function handleAbort() {
  askAi({})
}

onMounted(() => {
  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      if (mutation.attributeName === 'class') {
        const element = mutation.target
        const textAreaClass = [...element.classList].find(className =>
          className.includes('textArea')
        )
        if (textAreaClass) {
          element.style.height = '200px'
          element.style.minHeight = '153px'
        }
        const scrollableContainerClass = [...element.classList].find(className =>
          className.includes('scrollableContainer')
        )
        if (scrollableContainerClass) {
          element.style.height = '200px'
        }
      }
    })
  })

  observer.observe(document.body, {attributes: true, subtree: true})
})
</script>

<style lang="scss" module>
.discordSuperButton {
  position: fixed;
  right: 16px;
  bottom: 18px;
  z-index: 999999999 !important;
}
</style>

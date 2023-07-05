<template>
  <section
    :class="{
      [$style.container]: true,
      [$style.showProptEditor]: showEditor,
    }"
  >
    <HeaderPanel @on-close="handleClosePopup" />
    <PromptList
      v-if="!isAskPage"
      :prompts="store.config.prompts"
      :selected-index="selectedPrompt.index"
      @on-add-prompt="handleAddPrompt"
      @on-change="handleChanegPrompt"
      @on-edit-prompt="handleEditPrompt"
    />
    <PromptInput
      v-model="inputCommand"
      :disabled="aiThinking"
      :loading="aiThinking"
      :selected-text="store.selectedText"
      @on-change="handeInputCommandChnage"
      @on-submit="popUpAskIA"
    />
    <WebpilotAlert v-if="showError" style="margin-top: 8px" :tips="errorMessage" type="error" />
    <ShortcutTips v-if="store.config.showShortcutTips" :show-text-tips="true" tips-text="hello?" />
    <PromptResult v-model="result" />
    <PromptEditor
      :disable-delete="disableDeletePropmt"
      :prompt="selectedPrompt.prompt"
      :show-editor="showEditor"
      @on-delete="handleDeletePrompt"
      @on-hide="handleCloseEditor"
      @on-save="handleSavePrompt"
    />
  </section>
</template>

<script setup>
import {computed, onMounted, reactive, ref, watch} from 'vue'
import {Readability, isProbablyReaderable} from '@mozilla/readability'
import {Storage} from '@plasmohq/storage'

import {useMagicKeys} from '@vueuse/core'
import {storeToRefs} from 'pinia'

import {LAST_PROMPT_STORAGE_KEY} from '@/config'

import HeaderPanel from '@/components/HeaderPanel.vue'
import PromptInput from '@/components/PromptInput.vue'
import ShortcutTips from '@/components/ShortcutTips.vue'
import PromptList from '@/components/PromptList.vue'
import PromptEditor from '@/components/PromptEditor.vue'
import PromptResult from '@/components/PromptResult.vue'
import useStore from '@/stores/store'
import useAskAi from '@/hooks/useAskAi'
import WebpilotAlert from '@/components/WebpilotAlert.vue'

const storage = new Storage()

const store = useStore()

const {config} = storeToRefs(store)

const {loading: aiThinking, result, errorMessage, askAi} = useAskAi()

const emits = defineEmits(['closePopup'])
const props = defineProps({
  isAskPage: {
    type: Boolean,
    default: false,
  },
})

const showEditor = ref(false)
const inputCommand = ref('')
const selectedPrompt = reactive({
  index: -1,
  prompt: {
    title: '',
    command: '',
  },
})

// keyboard
useMagicKeys({
  passive: false,
  onEventFired(e) {
    if (e.key === 'Escape') {
      emits('closePopup')
    }
  },
})

// watch(Escape, v => {
//   if (v) {
//     emits('closePopup')
//   }
// })

const lastKey = props.isAskPage ? LAST_PROMPT_STORAGE_KEY.COMMON : LAST_PROMPT_STORAGE_KEY.SELECTED

onMounted(async () => {
  const lastPrompt = (await storage.get(lastKey)) || ''
  inputCommand.value = lastPrompt

  if (props.isAskPage) return

  // init selected prompt
  const index = store.config.latestPresetPromptIndex
  if (index >= 0 && store.config.prompts[index]) {
    selectedPrompt.index = index
    selectedPrompt.prompt = store.config.prompts[index]
  }
})

watch(
  () => selectedPrompt.prompt.command,
  newValue => {
    inputCommand.value = newValue
  }
)

const showError = ref(false)

const getPageContent = () => {
  const cloneNode = document.cloneNode(true)

  if (isProbablyReaderable(cloneNode)) {
    try {
      const article = new Readability(cloneNode).parse()
      const pageContent = {
        ...article,
      }
      pageContent.content = pageContent.textContent
      delete pageContent.textContent

      return pageContent
    } catch {}
  }

  const customContent = getCustomContent()

  return customContent
  // return `${document.body.innerText}\n${
  //   document.querySelector('#read-only-cursor-text-area')?.value
  // }`
}

const getPageMeta = () => {
  const meta = {}
  let cnt = 0

  function processMetaElement(element) {
    const name = element.getAttribute('name')
    const property = element.getAttribute('property')
    const content = element.getAttribute('content')

    if (content) {
      if (property) {
        if (property.startsWith('og:image')) {
          return true
        }
        if (property.startsWith('og:')) {
          meta[property] = content
          cnt += 1
          return true
        }
      }
      if (name) {
        if (name.startsWith('article:')) {
          meta[name] = content
          cnt += 1
          return true
        }
        if (name.startsWith('description')) {
          meta[name] = content
          cnt += 1
          return true
        }
      }
    }

    return false
  }

  const metaElements = document.querySelectorAll('meta')
  for (let i = 0; i < metaElements.length; i++) {
    processMetaElement(metaElements[i])
    if (cnt > 10) {
      break
    }
  }

  return meta
}

const getCustomContent = () => {
  const customContent = {
    content: document.body.innerText,
    title: document.title,
    ...getPageMeta(),
  }

  const regex = /github\.com\/(?:[\w-]+\/)*blob\//
  if (regex.test(window.location.href)) {
    customContent.code = document.querySelector('#read-only-cursor-text-area')?.value
  }

  return customContent
}

const getPageReference = () => {
  let reference = ''
  const content = getPageContent()

  for (const [key, value] of Object.entries(content)) {
    if (value) {
      reference += `${key}: ${value}\n`
    }
  }

  return reference
}

const popUpAskIA = async () => {
  const command = inputCommand.value !== '' ? inputCommand.value : selectedPrompt.prompt.command

  try {
    await askAi({
      referenceText: props.isAskPage ? getPageReference() : store.selectedText,
      command,
      isAskPage: props.isAskPage,
    })

    if (selectedPrompt.index === -1) {
      storage.set(lastKey, inputCommand.value)

      store.updateConfig({
        latestPresetPromptIndex: -1,
      })
    }

    showError.value = false
  } catch {
    showError.value = true
  }
}

const handleCloseEditor = () => {
  showEditor.value = false
}

const handleShowEditor = () => {
  showEditor.value = true
}

const handleChanegPrompt = promptInfo => {
  const {index, prompt} = promptInfo
  selectedPrompt.index = index
  selectedPrompt.prompt = prompt
  inputCommand.value = prompt.command

  store.updateConfig({
    latestPresetPromptIndex: index,
  })

  popUpAskIA()
}

const handeInputCommandChnage = () => {
  selectedPrompt.index = -1
}

const handleEditPrompt = promptInfo => {
  const {index, prompt} = promptInfo
  selectedPrompt.index = index
  selectedPrompt.prompt = prompt

  handleShowEditor()
}

const handleSavePrompt = prompt => {
  selectedPrompt.prompt = prompt

  const {prompts} = config.value
  prompts[selectedPrompt.index] = prompt

  store.updateConfig({
    prompts,
    latestPresetPromptIndex: selectedPrompt.index,
  })
  handleCloseEditor()
}

const handleDeletePrompt = () => {
  const {prompts} = config.value
  prompts.splice(selectedPrompt.index, 1)
  store.setPrompts(prompts)

  inputCommand.value = ''
  handleCloseEditor()
}

const handleAddPrompt = () => {
  selectedPrompt.index = store.config.prompts.length
  selectedPrompt.prompt = {title: '', command: ''}
  handleShowEditor()
}

const disableDeletePropmt = computed(() => {
  return store.config.prompts.length === 1
})

const handleClosePopup = () => {
  emits('closePopup')
}
</script>

<style lang="scss" module>
.container {
  position: relative;
  padding: 16px;
  padding-top: 12px;
  color: #000;
  font-size: 24px;
}

.showProptEditor {
  height: 341px;
}
</style>

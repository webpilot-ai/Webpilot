<template>
  <section
    :class="{
      [$style.container]: true,
      [$style['container--jaw']]: !showResult && !showPrompts,
    }"
  >
    <!-- [$style.showPromptEditor]: showEditor,
    <HeaderPanel @on-close="handleClosePopup" /> -->
    <!-- <PromptList
      v-if="showPrompts"
      :prompts="store.config.prompts"
      :selected-index="selectedPrompt.index"
      @on-add-prompt="handleAddPrompt"
      @on-change="handleChangePrompt"
      @on-edit-prompt="handleEditPrompt"
    /> -->
    <PromptInput
      v-model="inputCommand"
      :disabled="aiThinking"
      :loading="aiThinking"
      :prompts="store.config.prompts"
      :selected-text="store.selectedText"
      :show-collect="showResult && !aiThinking && !showPrompts"
      :show-menu="showPrompts"
      @on-add-prompt="handleAddPrompt"
      @on-change="handleInputCommandChange"
      @on-focus="handleInputFocus"
      @on-submit="popUpAskAi"
    />
    <WebpilotAlert v-if="showError" :class="$style.alert" :tips="errorMessage" type="error" />
    <!-- <ShortcutTips v-if="store.config.showShortcutTips" :show-text-tips="true" tips-text="hello?" /> -->
    <PromptResult v-model="result" :show-shadow="showMenu" />
    <FloatControlButtons
      v-show="!showEditor"
      :show-back="showMenu"
      :show-setting="showResult"
      @on-back="handlePopupTurnBack"
      @on-close="handleClosePopup"
    />
    <PromptMenu
      v-if="showPrompts"
      :prompts="store.config.prompts"
      :selected-index="selectedPrompt.index"
      :tab-index="chooseIndex"
      @on-change="handleChangePrompt"
      @on-edit-prompt="handleEditPrompt"
      @on-mouse-over="handleHoverPrompt"
    />
    <PromptEditor
      v-if="showEditor"
      :disable-delete="disableDeletePrompt"
      :prompt="selectedPrompt.prompt"
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

// import HeaderPanel from '@/components/HeaderPanel.vue'
import FloatControlButtons from '@/components/FloatControlButtons.vue'
import PromptInput from '@/components/PromptInput.vue'
// import ShortcutTips from '@/components/ShortcutTips.vue'
// import PromptList from '@/components/PromptList.vue'
import PromptMenu from '@/components/PromptMenu.vue'
import PromptEditor from '@/components/PromptEditor.vue'
import PromptResult from '@/components/PromptResult.vue'
import useStore from '@/stores/store'
import useAskAi from '@/hooks/useAskAi'
import WebpilotAlert from '@/components/WebpilotAlert.vue'

const storage = new Storage()

const store = useStore()

const {config} = storeToRefs(store)

const {loading: aiThinking, result, errorMessage, askAi, generating} = useAskAi()

const emits = defineEmits(['closePopup'])
const props = defineProps({
  isAskPage: {
    type: Boolean,
    default: false,
  },
})

const showEditor = ref(false)
const showMenu = ref(false)
const inputCommand = ref('')
const chooseIndex = ref(-1)
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
    if (!showPrompts.value) return
    let index = chooseIndex.value
    if (e.key === 'Tab' && e.type === 'keydown') {
      const {length} = store.config.prompts
      if (e.shiftKey && index === -1) chooseIndex.value = length - 1
      else if (e.shiftKey) chooseIndex.value = (--index + length) % length
      else chooseIndex.value = ++index % length
      e.preventDefault()
    }
    if (e.key === 'Enter' && e.type === 'keyup') {
      if (index === -1) popUpAskAi()
      else handleChangePrompt({index, prompt: store.config.prompts[index]})
      e.preventDefault()
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
    chooseIndex.value = index
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
    title: document.title,
    ...getPageMeta(),
    content: document.body.innerText,
  }

  const regex = /github\.com\/(?:[\w-]+\/)*blob\//
  if (regex.test(window.location.href)) {
    customContent.code = document.querySelector('#read-only-cursor-text-area')?.value
  }

  return customContent
}

const getPageReference = () => {
  let reference = ''
  const pageContent = getPageContent()
  let code = ''
  let content = ''

  for (const [key, value] of Object.entries(pageContent)) {
    if (value) {
      if (key === 'code') {
        code = `${key}: ${value}\n`
        continue
      }
      if (key === 'content') {
        content = `${key}: ${value}`
        continue
      }
      reference += `${key}: ${value}\n`
    }
  }
  reference += code + content

  return reference
}

const popUpAskAi = async () => {
  showMenu.value = false
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
const handleShowMenu = () => {
  showMenu.value = true
}

const handleChangePrompt = promptInfo => {
  const {index, prompt} = promptInfo
  selectedPrompt.index = index
  chooseIndex.value = index
  selectedPrompt.prompt = prompt
  inputCommand.value = prompt.command

  store.updateConfig({
    latestPresetPromptIndex: index,
  })

  popUpAskAi()
}
const handleHoverPrompt = ({index}) => {
  chooseIndex.value = index
}

const handleInputCommandChange = () => {
  selectedPrompt.index = -1
  chooseIndex.value = -1
}

const handleInputFocus = () => {
  if (showPrompts.value && !showResult.value) inputCommand.value = ''
  if (!showPrompts.value && showResult.value) handleShowMenu()
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

const handleAddPrompt = command => {
  selectedPrompt.index = store.config.prompts.length
  selectedPrompt.prompt = {title: '', command}
  handleShowMenu()
  handleShowEditor()
}

const disableDeletePrompt = computed(() => store.config.prompts.length === 1)

const showResult = computed(() => {
  return !!result.value && result.value !== ''
})

const showPrompts = computed(() => {
  return (
    (showMenu.value || (!props.isAskPage && !showResult.value)) &&
    !aiThinking.value &&
    !generating.value &&
    !showEditor.value
  )
})

const handleClosePopup = () => {
  emits('closePopup')
}
const handlePopupTurnBack = () => {
  showMenu.value = false
}
</script>

<style lang="scss" module>
.container {
  position: relative;

  &--jaw {
    padding-bottom: 8px;
  }

  // padding: 8px;
  // color: #000;
  // font-size: 24px;
  // background-color: var(--webpilot-theme-main-background-color, #fff);
  // border-radius: 10px;
}

// .showPromptEditor {
//   height: 341px;
// }

.alert {
  margin-top: 8px;
}
</style>

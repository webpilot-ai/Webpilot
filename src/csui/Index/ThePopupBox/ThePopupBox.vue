<template>
  <section
    :class="{
      [$style.container]: true,
      [$style['container--alone']]: !showResult && !showPrompts,
      [$style['container--joint']]: showMenu || (!showResult && showPrompts),
    }"
  >
    <!-- [$style.showPromptEditor]: showEditor,
    <HeaderPanel @on-close="handleClosePopup" /> -->
    <!-- <PromptList
      v-if="showPrompts"
      :prompts="currentPromptsList"
      :selected-index="selectedPrompt.index"
      @on-add-prompt="handleAddPrompt"
      @on-change="handleChangePrompt"
      @on-edit-prompt="handleEditPrompt"
    /> -->
    <PromptInput
      v-model="inputCommand"
      :disabled="aiThinking"
      :loading="aiThinking"
      :prompts="currentPromptsList"
      :selected-text="store.selectedText"
      :show-collect="showResult && !aiThinking && !showPrompts"
      :show-menu="showPrompts"
      :show-prefix="showLogo"
      @on-add-prompt="handleAddPrompt"
      @on-change="handleCommandChange"
      @on-focus="handleInputFocus"
      @on-submit="popUpAskAi"
    />
    <WebpilotAlert v-if="showError" :class="$style.alert" :tips="errorMessage" type="error" />
    <!-- <ShortcutTips v-if="store.config.showShortcutTips" :show-text-tips="true" tips-text="hello?" /> -->
    <PromptResult v-model="result" :show-shadow="showMenu" />
    <FloatControlButtons
      v-show="!showEditor"
      :result="result"
      :show-back="showMenu"
      :show-copy="showResult"
      :show-setting="showResult || showError"
      @on-back="handlePopupTurnBack"
      @on-close="handleClosePopup"
    />
    <PromptMenu
      v-if="showPrompts"
      :prompts="currentPromptsList"
      :selected-index="selectedPrompt.index"
      :show-back="showMenu"
      :tab-index="chooseIndex"
      @on-change="handleChangePrompt"
      @on-edit-prompt="handleEditPrompt"
      @on-mouse-over="handleHoverPrompt"
    />
    <PromptEditor
      v-if="showEditor"
      :disable-delete="hidePromptDelete"
      :prompt="selectedPrompt.prompt"
      @on-delete="handleDeletePrompt"
      @on-hide="handleCloseEditor"
      @on-save="handleSavePrompt"
      @on-send="handleAskPrompt"
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
const showLogo = ref(true)
const inputCommand = ref('')
const chooseIndex = ref(-1)
const selectedPrompt = reactive({
  index: -1,
  prompt: {
    title: '',
    command: '',
  },
})
const currentPromptsList = computed(() => {
  return props.isAskPage ? store.config.AskedQuestionPrompts : store.config.TextSelectionPrompts
})
const currentPromptsIndexName = computed(() => {
  return props.isAskPage ? 'latestAskedQuestionPromptIndex' : 'latestTextSelectionPromptIndex'
})

// keyboard
useMagicKeys({
  passive: false,
  onEventFired(e) {
    // press esc
    if (e.type === 'keyup' && e.key === 'Escape') {
      if (showEditor.value) showEditor.value = false
      else if (showMenu.value) showMenu.value = false
      else emits('closePopup')
      return
    }

    // control prompts list
    if (!showPrompts.value) return
    const index = chooseIndex.value
    const {length} = currentPromptsList
    if (e.key === 'ArrowUp' && e.type === 'keyup') {
      e.preventDefault()
      chooseIndex.value = index - 1 < 0 ? length - 1 : index - 1
    }
    if (e.key === 'ArrowDown' && e.type === 'keyup') {
      e.preventDefault()
      chooseIndex.value = index + 1 >= length ? 0 : index + 1
    }
    if (e.key === 'Enter' && e.type === 'keyup') {
      e.preventDefault()
      if (index === -1) popUpAskAi()
      else handleChangePrompt({index, prompt: currentPromptsList[index]})
    }
  },
})

// watch(Escape, v => {
//   if (v) {
//     emits('closePopup')
//   }
// })

const lastKey = props.isAskPage ? LAST_PROMPT_STORAGE_KEY.COMMON : LAST_PROMPT_STORAGE_KEY.SELECTED
// const lastKey = LAST_PROMPT_STORAGE_KEY.COMMON

onMounted(async () => {
  // const lastPrompt = (await storage.get(lastKey)) || ''
  // const lastPrompt = props.isAskPage ? await storage.get(lastKey) : store.selectedText
  // inputCommand.value = lastPrompt
  // if (!props.isAskPage) return
  const lastCommand = await storage.get(lastKey)
  // first visit
  if (!lastCommand) return
  inputCommand.value = lastCommand

  // init selected prompt
  const index = store.config[currentPromptsIndexName.value]
  if (index >= 0 && currentPromptsList.value[index]) {
    selectedPrompt.index = index
    chooseIndex.value = index
    selectedPrompt.prompt = currentPromptsList.value[index]
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

      store.updateConfig({[currentPromptsIndexName.value]: -1})
    }

    showError.value = false
    showLogo.value = false
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

  store.updateConfig({[currentPromptsIndexName.value]: index})

  popUpAskAi()
}
const handleHoverPrompt = ({index}) => {
  chooseIndex.value = index
}

const handleCommandChange = () => {
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

  const data = {}
  if (props.isAskPage) {
    const {AskedQuestionPrompts} = config.value
    AskedQuestionPrompts[selectedPrompt.index] = prompt
    data.latestAskedQuestionPromptIndex = selectedPrompt.index
    data.AskedQuestionPrompts = AskedQuestionPrompts
  } else {
    const {TextSelectionPrompts} = config.value
    TextSelectionPrompts[selectedPrompt.index] = prompt
    data.latestTextSelectionPromptIndex = selectedPrompt.index
    data.TextSelectionPrompts = TextSelectionPrompts
  }
  handleCloseEditor()
  store.updateConfig(data)
}

const handleAskPrompt = command => {
  showEditor.value = false
  inputCommand.value = command
  popUpAskAi()
}

const handleDeletePrompt = () => {
  if (props.isAskPage) {
    const {AskedQuestionPrompts} = config.value
    AskedQuestionPrompts.splice(selectedPrompt.index, 1)
    store.updateConfig({AskedQuestionPrompts})
  } else {
    const {TextSelectionPrompts} = config.value
    TextSelectionPrompts.splice(selectedPrompt.index, 1)
    store.updateConfig({TextSelectionPrompts})
  }
  inputCommand.value = ''
  handleCloseEditor()
}

const handleAddPrompt = command => {
  selectedPrompt.index = currentPromptsList.value ? currentPromptsList.value.length : 0
  selectedPrompt.prompt = {title: '', command}
  handleShowMenu()
  handleShowEditor()
}

const hidePromptDelete = computed(() => {
  return (
    currentPromptsList.value.length === 1 ||
    (currentPromptsList.value && selectedPrompt.index === currentPromptsList.value.length)
  )
})

const showResult = computed(() => {
  return !!result.value && result.value !== ''
})

const showPrompts = computed(() => {
  return (
    (showMenu.value || !showResult.value) &&
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
  background-color: var(--webpilot-theme-main-background-color, #fff);
  border-radius: 10px;
  box-shadow: 0 2px 6px var(--webpilot-theme-main-background-shadow, rgb(0 0 0 / 20%));

  &--alone {
    padding-bottom: 8px;
  }

  &--joint {
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0;
  }
}

.alert {
  margin: 8px 8px 0;
}
</style>

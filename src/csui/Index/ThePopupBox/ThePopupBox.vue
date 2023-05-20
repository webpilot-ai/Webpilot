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
import {Readability} from '@mozilla/readability'

import {useMagicKeys} from '@vueuse/core'
import {storeToRefs} from 'pinia'

import HeaderPanel from '@/components/HeaderPanel.vue'
import PromptInput from '@/components/PromptInput.vue'
import ShortcutTips from '@/components/ShortcutTips.vue'
import PromptList from '@/components/PromptList.vue'
import PromptEditor from '@/components/PromptEditor.vue'
import PromptResult from '@/components/PromptResult.vue'
import useStore from '@/stores/store'
import useAskAi from '@/hooks/useAskAi'
import WebpilotAlert from '@/components/WebpilotAlert.vue'

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
const {Escape} = useMagicKeys()
watch(Escape, v => {
  if (v) {
    emits('closePopup')
  }
})

onMounted(() => {
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

const popUpAskIA = async () => {
  const command = inputCommand.value !== '' ? inputCommand.value : selectedPrompt.prompt.command

  let article = ''
  if (props.isAskPage) {
    const cloneNode = document.cloneNode(true)
    article = new Readability(cloneNode).parse()
  }

  try {
    await askAi({
      referenceText: props.isAskPage ? article.textContent : store.selectedText,
      command,
    })
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

  store.setConfig({
    ...store.config,
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

  store.setConfig({
    ...store.config,
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

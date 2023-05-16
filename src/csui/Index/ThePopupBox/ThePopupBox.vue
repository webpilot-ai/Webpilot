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
      :prompts="storeConfig.config.prompts"
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
    <ShortcutTips
      v-if="storeConfig.config.showShortcutTips"
      :show-text-tips="true"
      tips-text="hello?"
    />
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
import {useToast} from 'vue-toast-notification'

import {useMagicKeys} from '@vueuse/core'

import HeaderPanel from '@/components/HeaderPanel.vue'
import PromptInput from '@/components/PromptInput.vue'
import ShortcutTips from '@/components/ShortcutTips.vue'
import PromptList from '@/components/PromptList.vue'
import PromptEditor from '@/components/PromptEditor.vue'
import PromptResult from '@/components/PromptResult.vue'
import useConfigStore from '@/stores/config'
import useStore from '@/stores/store'
import useAskAi from '@/hooks/useAskAi'

const storeConfig = useConfigStore()
const store = useStore()
const toast = useToast()

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
  const index = storeConfig.config.latestPresetPromptIndex
  if (index >= 0 && storeConfig.config.prompts[index]) {
    selectedPrompt.index = index
    selectedPrompt.prompt = storeConfig.config.prompts[index]
  }
})

watch(
  () => selectedPrompt.prompt.command,
  newValue => {
    inputCommand.value = newValue
  }
)

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
  } catch {
    toast.open({
      message: errorMessage.value,
      type: 'error',
      position: 'top',
    })
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
  storeConfig.setLatestPromptIndex(index)

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
  storeConfig.updatePrompt(selectedPrompt.index, prompt)
  storeConfig.setLatestPromptIndex(selectedPrompt.index)
  handleCloseEditor()
}

const handleDeletePrompt = () => {
  storeConfig.deletePrompt(selectedPrompt.index)
  inputCommand.value = ''
  handleCloseEditor()
}

const handleAddPrompt = () => {
  selectedPrompt.index = storeConfig.config.prompts.length
  selectedPrompt.prompt = {title: '', command: ''}
  handleShowEditor()
}

const disableDeletePropmt = computed(() => {
  return storeConfig.config.prompts.length === 1
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

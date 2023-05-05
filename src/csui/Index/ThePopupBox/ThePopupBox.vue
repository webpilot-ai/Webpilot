<template>
  <section
    :class="{
      [$style.container]: true,
      [$style.showProptEditor]: showEditor,
    }"
  >
    <HeaderPanel @on-close="handleClosePopup" />
    <PromptList
      :prompts="storeConfig.config.prompts"
      :selected-index="selectedPrompt.index"
      @on-add-prompt="handleAddPrompt"
      @on-change="handleChanegPrompt"
      @on-edit-prompt="handleEditPrompt"
    />
    <PromptInput v-model="inputCommand" @on-change="handeInputCommandChnage" />
    <!-- <TipsGroup /> -->
    <PromptResult />
    <PromptEditor
      :disable-delete="disableDeletePropmt"
      :prompt="selectedPrompt.prompt"
      :show-editor="showEditor"
      @on-delete="handleDeletePrompt"
      @on-hide="handleCloseEditor"
      @on-save="handleSavePrompt"
    />

    <!-- Debug Tools -->
    <!-- <button @click="storeConfig.___debuResetConfig">Reset Config</button> -->
  </section>
</template>

<script setup>
import {computed, reactive, ref, watch} from 'vue'

import HeaderPanel from '@/components/HeaderPanel.vue'
import PromptInput from '@/components/PromptInput.vue'
// import TipsGroup from '@/components/TipsGroup.vue'
import PromptList from '@/components/PromptList.vue'
import PromptEditor from '@/components/PromptEditor.vue'
import PromptResult from '@/components/PromptResult.vue'
import useConfigStore from '@/stores/config'

const storeConfig = useConfigStore()

const emits = defineEmits(['closePopup'])

const showEditor = ref(false)
const inputCommand = ref()
const selectedPrompt = reactive({
  index: -1,
  prompt: {
    title: '',
    command: '',
  },
})

watch(
  () => selectedPrompt.prompt.command,
  newValue => {
    inputCommand.value = newValue
  }
)

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
  handleCloseEditor()
}

const handleDeletePrompt = () => {
  storeConfig.deletePrompt(selectedPrompt.index)
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

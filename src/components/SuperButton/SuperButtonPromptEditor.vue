<template>
  <section :class="$style.container">
    <section :class="$style.header">
      <section :class="$style.intro">
        <div>Prompt for</div>
        <div :class="$style.title">{{ title }}</div>
      </section>
      <img :class="$style.close" :src="closeIcon" @click="handleClose" />
    </section>

    <section :class="$style.promptEditor">
      <input
        v-model="newPrompt"
        :class="[$style.promptInput, {[$style.pr8]: !newPrompt}]"
        :placeholder="prompt"
      />
      <img v-if="!!newPrompt" :class="$style.save" :src="sendIcon" @click="handleSave" />
    </section>
  </section>
</template>

<script setup>
import {ref} from 'vue'

import closeIcon from '@assets/icon/close.svg'
import sendIcon from '@assets/icon/sendActive.svg'

const emits = defineEmits(['close', 'savePrompt'])

const props = defineProps({
  title: {type: String, default: ''},
  prompt: {type: String, default: ''},
})

const newPrompt = ref('')

function handleClose() {
  emits('close')
}

function handleSave() {
  const value = newPrompt.value.trim() || props.prompt
  emits('close')
  emits('savePrompt', {prompt: value})

  resetNewPrompt()
}

function resetNewPrompt() {
  newPrompt.value = ''
}
</script>

<style lang="scss" module>
.container {
  padding: 12px 16px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 8px 24px rgb(149 157 165 / 20%);
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.intro {
  display: flex;
  height: 17px;
  margin: 4px 0 8px;
  color: #929497;
  font-weight: 500;
  font-size: 12px;
  line-height: 17px;
}

.title {
  margin-left: 6px;
  color: #4f5aff;
}

.close {
  width: 22px;
  height: 22px;
  margin-bottom: 5px;
  cursor: pointer;

  &:hover {
    filter: brightness(2);
  }
}

.promptEditor {
  position: relative;
  display: flex;
  justify-items: center;
}

.promptInput {
  width: 100%;
  height: 36px;
  padding-right: 38px;
  padding-left: 8px;
  color: #292929;
  line-height: 36px;
  border: 1px solid #dcdee1;
  border-radius: 5px;

  &::placeholder {
    color: #929497;
  }
}

.pr8 {
  padding-right: 8px;
}

.save {
  position: absolute;
  top: 7px;
  right: 8px;
  width: 22px;
  height: 22px;
  cursor: pointer;
}
</style>

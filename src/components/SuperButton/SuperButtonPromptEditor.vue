<template>
  <section :class="$style.container">
    <section :class="$style.header">
      <section :class="$style.intro">
        <div>Prompt for</div>
        <div :class="$style.title">{{ title }}</div>
      </section>
      <Popper :class="$style.popover" hover offset-distance="4" placement="top">
        <img :class="$style.close" :src="closeIcon" @click="handleClose" />
        <template #content>
          <span :class="$style.popoverText">Close</span>
        </template>
      </Popper>
    </section>

    <section :class="$style.promptEditor">
      <input
        v-model="newPrompt"
        :class="[$style.promptInput, {[$style.pr8]: !newPrompt}]"
        :placeholder="prompt"
        @focus="handleFocus"
      />
      <Popper :class="$style.popover" hover offset-distance="0" offset-skid="-12" placement="top">
        <img v-if="!!newPrompt" :class="$style.save" :src="sendIcon" @click="handleSave" />
        <template #content>
          <span :class="$style.popoverText">Save</span>
        </template>
      </Popper>
    </section>
  </section>
</template>

<script setup>
import {ref} from 'vue'

import Popper from 'vue3-popper'

import closeIcon from 'data-url:@assets/icon/close.svg'
import sendIcon from 'data-url:@assets/icon/sendActive.svg'

const emits = defineEmits(['close', 'savePrompt'])

const props = defineProps({
  title: {type: String, default: ''},
  prompt: {type: String, default: ''},
})

const newPrompt = ref('')

function handleFocus() {
  newPrompt.value = props.prompt
}

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
  padding: 16px 16px 12px;
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
  margin: 0 0 8px;
  color: #929497;
  font-weight: 500;
  font-size: 12px;
  line-height: 17px;
}

.title {
  margin-left: 3px;
  color: #4f5aff;
}

.close {
  width: 17px;
  height: 17px;
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
  background-color: #fff;
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

.popover {
  /* max-height: 24px;
  line-height: 24px; */
}

.popoverText {
  padding: 4px 8px;
  color: #fff;
  font-weight: 500;
  font-size: 12px;
  line-height: 17px;
  background-color: black;
  border-radius: 5px;
}
</style>

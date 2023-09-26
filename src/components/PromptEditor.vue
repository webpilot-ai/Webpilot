<template>
  <section v-if="showEditor" :class="$style.propmtEditorWrap">
    <section :class="$style.editor">
      <section :class="$style.header">
        <span>Edit Prompt</span>
        <IconClose :class="$style.closeIcon" @click="handleHideEditor" />
      </section>
      <section :class="$style.promptName">
        <label>Name</label>
        <input v-model="title" :class="$style.inputName" :placeholder="prompt.title" type="text" />
      </section>
      <section :class="$style.promptCommand">
        <label>Prompt</label>
        <textarea
          v-model="command"
          :class="$style.inputCommand"
          :placeholder="prompt.command"
        ></textarea>
      </section>
      <section :class="$style.btnGroup">
        <WebpilotButton
          :disabled="disableDelete"
          type="ghost"
          value="DELETE"
          @click="handleDelete"
        />
        <WebpilotButton :class="$style.confirmBtn" value="SAVE PROMPT" @click="handleSave" />
      </section>
    </section>
  </section>
</template>

<script setup>
import {ref, watchEffect} from 'vue'

import IconClose from './icon/IconClose.vue'
import WebpilotButton from './WebpilotButton.vue'

const emits = defineEmits(['onDelete', 'onSave', 'onHide'])

const props = defineProps({
  showEditor: {
    type: Boolean,
    default: false,
  },
  prompt: {
    type: Object,
    default: () => {
      return {title: '', command: ''}
    },
  },
  disableDelete: {
    type: Boolean,
    default: false,
  },
})

const title = ref(props.prompt.title)
const command = ref(props.prompt.command)

const handleSave = () => {
  emits('onSave', {
    title: title.value,
    command: command.value,
  })
}

const handleDelete = () => {
  emits('onDelete', {
    title: title.value,
    command: command.value,
  })
}

const handleHideEditor = () => {
  emits('onHide')
}

watchEffect(() => {
  title.value = props.prompt.title
  command.value = props.prompt.command
})
</script>

<style lang="scss" module>
.propmtEditorWrap {
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 341px;
  background-color: rgb(0 0 0 / 50%);
  backdrop-filter: blur(2px);
}

.editor {
  width: 430px;
  height: 310px;
  padding: 16px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 8px 24px rgb(149 157 165 / 20%);
}

.header {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 12px !important;
  color: #000;
  font-weight: 400;
  font-size: 18px;
  line-height: 25px;
}

.closeIcon {
  margin-left: auto;
  cursor: pointer;
}

.promptName,
.promptCommand {
  display: flex;
  flex-direction: column;
  align-items: start;
  color: #000;
  font-weight: 400;
  font-size: 14px;
  font-style: normal;
  line-height: 20px;
}

.inputName {
  height: 36px;
  margin-top: 4px;
  padding: 8px;
  border: 1px solid #dcdee1;
  border-radius: 5px;

  &:focus {
    outline: none;
  }
}

.promptCommand {
  margin-top: 16px !important;
}

.inputCommand {
  width: 398px;
  height: 97px;
  margin-top: 4px;
  padding: 8px;
  border: 1px solid #dcdee1;
  border-radius: 5px;
  resize: none;

  &:focus,
  &:focus-visible {
    outline: none;
  }
}

.btnGroup {
  display: flex;
  justify-content: flex-end;
  margin-top: 12px !important;
}

.confirmBtn {
  margin-left: 2px !important;
}
</style>

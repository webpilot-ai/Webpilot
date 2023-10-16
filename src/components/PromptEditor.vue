<template>
  <!-- <section v-if="showEditor" :class="$style['background-shadow']"> -->
  <article :class="$style.container">
    <section :class="$style.container__body">
      <textarea
        ref="textareaRef"
        v-model="command"
        :class="$style.content__textarea"
        :placeholder="prompt.command"
      ></textarea>
      <IconSendFill :class="$style.content__send" />
      <article :class="$style.content__back">
        <InteractiveIcon type="previous" @click="handleHideEditor" />
      </article>
    </section>
    <section :class="$style.container__footer">
      <article :class="$style['form-name']">
        <input
          v-model="title"
          :class="[$style['form-name__txt'], {[$style['form-name__txt--focus']]: nameFocused}]"
          :placeholder="prompt.title || 'Add Name'"
          type="text"
          @blur="onNameInputBlur"
          @focus="onNameInputFocus"
        />
        <IconPencilEdit v-if="nameFocused" :class="$style['form-name__ico']" />
        <IconPencil v-else :class="$style['form-name__ico']" />
      </article>
      <InteractiveIcon
        v-show="disableDelete"
        :class="$style['form-button']"
        :label="$gettext('DELETE')"
        type="delete"
        @click="handleDelete"
      />
      <InteractiveIcon
        :class="$style['form-button']"
        :label="$gettext('SAVE PROMPT')"
        type="save"
        @click="handleSave"
      />
    </section>
  </article>
  <!-- </section> -->
</template>

<script setup>
import {ref, onMounted, watch, nextTick, watchEffect} from 'vue'

import {$gettext} from '@/utils/i18n'

import IconPencil from '@/components/icon/IconPencil.vue'
import IconPencilEdit from '@/components/icon/IconPencilEdit.vue'

import IconSendFill from './icon/IconSendFill.vue'
import InteractiveIcon from './InteractiveIcon/InteractiveIcon.vue'

const emits = defineEmits(['onDelete', 'onSave', 'onHide'])
const props = defineProps({
  // showEditor: {
  //   type: Boolean,
  //   default: false,
  // },
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
const nameFocused = ref(false)
const textareaRef = ref(null)

const autoResize = () => {
  const textarea = textareaRef.value
  if (!textarea) return
  textarea.style.height = 'auto'
  textarea.style.height = `${textarea.scrollHeight}px`
}

onMounted(async () => {
  await nextTick()
  autoResize()
})

watch(command, () => {
  autoResize()
})

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

const onNameInputFocus = () => {
  nameFocused.value = true
}
const onNameInputBlur = () => {
  nameFocused.value = false
}
</script>

<style lang="scss" module>
// .background-shadow {
//   position: absolute;
//   top: 0;
//   left: 0;
//   width: 100%;
//   border-radius: 10px;
//   backdrop-filter: blur(2px);
//   background-color: rgb(0 0 0 / 50%);
// }

.container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  padding: 8px;
  background-color: var(--webpilot-theme-content-background-color, #fff);
  border-radius: 10px;
  box-shadow: 0 8px 24px rgb(149 157 165 / 20%);
}

.container__body {
  position: relative;
  display: flex;
  flex-direction: row;
  padding: 8px 0 8px 8px;
  border: 1px solid var(--webpilot-theme-stoke-and-hover-status, #dcdee1);
  border-radius: 5px;
}

.content__textarea {
  flex: 1;
  height: 20px;
  max-height: 196px;
  padding: 0 42px 0 0;
  overflow-y: auto;
  color: var(--webpilot-theme-main-text-color, #292929);
  font-size: 14px !important;
  line-height: 20px !important;
  background-color: var(--webpilot-theme-content-background-color, #fff);
  border: none;
  outline: none;
  appearance: none;
  appearance: none;
  resize: none;
}

.content__send {
  position: absolute;
  right: 12px;
  bottom: 6px;
  cursor: pointer;
}

.content__back {
  position: absolute;
  top: -1px;
  right: -53px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background-color: var(--webpilot-theme-main-background-color, #fff);
  border-radius: 8px;
  box-shadow: 0 2px 6px var(--webpilot-theme-main-background-shadow, rgb(0 0 0 / 20%));
  cursor: pointer;
}

.container__footer {
  display: flex;
  margin-top: 12px;
}

.form-name {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 20px;
  margin-right: auto;
  padding: 0 6px;
  border: 1px solid #dcdeff;
  border-radius: 10px;
}

.form-name__txt {
  width: 62px;
  padding: 0;
  color: var(--webpilot-theme-main-text-color, #292929);
  font-weight: 600 !important;
  font-size: 12px !important;
  line-height: 20px;
  background-color: var(--webpilot-theme-content-background-color, #fff);
  border: 0;
  outline: none;
}

.form-name__txt--focus {
  color: #4f5aff;
}

.form-name__ico {
  width: 12px;
  height: 12px;
  margin-left: 2px;
}

.form-button:last-of-type {
  margin-left: 40px;
}

// .form-button {
//   display: flex;
//   align-items: center;
//   cursor: pointer;
// }

// .form-button__txt {
//   margin-left: 4px;
//   font-weight: 600;
//   font-size: 14px;
// }

// .form-button__txt:hover {
//   text-decoration: underline;
// }

// .form-button--delete {
//   margin-right: 40px;
//   color: #585b58;
// }

// .form-button--save {
//   color: #4f5aff;
// }
</style>

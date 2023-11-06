<template>
  <!-- <section v-if="showEditor" :class="$style['background-shadow']"> -->
  <article :class="$style.container">
    <section :class="$style.container__body">
      <!-- <SendButton
        :activate="command !== ''"
        :class="$style.content__send"
        @click="handleSendCommand"
      /> -->
      <!-- <InteractiveIcon :class="$style.content__send" type="send" @click="handleSendCommand" /> -->
      <textarea
        ref="textareaRef"
        v-model="command"
        :class="$style.content__textarea"
        maxlength="2048"
        :placeholder="prompt.command || $gettext('Set a prompt here')"
      />
      <article :class="$style.content__back">
        <InteractiveIcon type="close" @click="handleHideEditor" />
      </article>
    </section>
    <section :class="$style.container__footer">
      <article :class="$style['form-name']">
        <!-- <input
          v-model="title"
          :class="[$style['form-name__txt'], {[$style['form-name__txt--focus']]: nameFocused}]"
          :placeholder="prompt.title || $gettext('Add name')"
          type="text"
          @blur="onNameInputBlur"
          @focus="onNameInputFocus"
        /> -->
        <input
          v-model="title"
          :class="$style['form-name__txt']"
          :placeholder="prompt.title || $gettext('Add name')"
          type="text"
        />
        <!-- <InteractiveIcon :hover-state="title === '' ? 1 : 2" :size="18" type="pencil" /> -->
      </article>
      <InteractiveIcon
        v-show="!disableDelete"
        :class="$style['form-button']"
        :label="$gettext('Delete')"
        type="delete"
        @click="handleDelete"
      />
      <InteractiveIcon
        :class="$style['form-button']"
        :label="$gettext('Save')"
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

import InteractiveIcon from './InteractiveIcon/InteractiveIcon.vue'
// import SendButton from './SendButton/Index.vue'

const emits = defineEmits(['onDelete', 'onSave', 'onHide', 'onSend'])
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
// const nameFocused = ref(false)
const textareaRef = ref(null)

const autoResize = () => {
  const textarea = textareaRef.value
  if (!textarea) return
  textarea.style.height = null
  textarea.style.height = `${textarea.scrollHeight}px`
}

onMounted(async () => {
  textareaRef.value.focus()
  await nextTick()
  autoResize()
})

watch(command, () => {
  autoResize()
})

const handleSave = () => {
  if (!command.value && !command.value.length) return
  if (!title.value) title.value = 'Prompt'
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

// const handleSendCommand = () => {
//   emits('onSend', command.value)
// }

watchEffect(() => {
  title.value = props.prompt.title
  command.value = props.prompt.command
})

// const onNameInputFocus = () => {
//   nameFocused.value = true
// }
// const onNameInputBlur = () => {
//   nameFocused.value = false
// }
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

  // display: flex;
  // flex-direction: row;
  padding: 8px 0 8px 8px;
  border: 1px solid var(--webpilot-theme-stoke-and-hover-status, #dcdee1);
  border-radius: 5px;
}

.content__textarea {
  display: block;
  width: 100%;
  height: 20px;
  max-height: 196px;

  // padding: 0 42px 0 0;
  padding: 0;
  overflow-y: auto;
  font-size: 14px !important;
  line-height: 20px !important;
  border: none;
  outline: none;
  appearance: none;
  resize: none;
}

.content__send {
  position: absolute;
  right: 12px;
  bottom: 6px;
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
  padding: 0 5px;
  font-size: 12px;
  border: 1px solid var(--webpilot-theme-stoke-and-hover-status, #dcdee1);
  border-radius: 5px;
}

.form-name__txt {
  width: 70px;
  height: 18px;
  padding: 0;
  font-weight: 600;
  line-height: 18px;
  border: 0;
  outline: none;
}

.content__textarea,
.form-name__txt {
  color: var(--webpilot-theme-main-text-color, #292929);
  font-weight: 400;
  background-color: var(--webpilot-theme-content-background-color, #fff);

  &::placeholder {
    color: #929497;
  }
}

// .form-name__txt--focus {
//   color: #4f5aff;
// }

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

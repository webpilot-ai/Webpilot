<template>
  <section :class="$style.frame">
    <article :class="[$style.container, {[$style['container--unfold']]: showMenu}]">
      <!-- <img :class="$style.logo" :src="WebpilotLogo" /> -->
      <input
        ref="refInput"
        v-model="localModelValue"
        :class="{[$style['input-area']]: true, [$style.promptInputDisabled]: disabled}"
        :disabled="disabled"
        :placeholder="placeholderText"
        type="text"
        @focus="handleFocus"
        @keydown.enter="handleSend"
      />
      <InteractiveIcon
        v-if="showSavePrompt"
        :class="$style['container__collect']"
        type="collect"
        @click="handleAddNewPrompt"
      />
      <div
        :class="{[$style.actionIcon]: true, [$style.promptInputDisabled]: disabled}"
        @click="handleSend"
      >
        <template v-if="!loading">
          <IconSend v-if="modelValue == ''" />
          <IconSendFill v-else />
        </template>
        <IconLoading v-else :class="$style.loading" />
      </div>
    </article>
  </section>
</template>

<script setup>
import {ref, computed} from 'vue'

// import WebpilotLogo from 'data-base64:~assets/icon.png'

import {$gettext} from '@/utils/i18n'

import InteractiveIcon from './InteractiveIcon/InteractiveIcon.vue'
import IconSend from './icon/IconSend.vue'
import IconSendFill from './icon/IconSendFill.vue'
import IconLoading from './icon/IconLoading.vue'

const emits = defineEmits(['update:modelValue', 'onChange', 'onSubmit', 'onFocus', 'onAddPrompt'])

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: $gettext('Ask a question about this webpage'),
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  selectedText: {
    type: String,
    default: '',
  },
  loading: {
    type: Boolean,
    default: false,
  },
  showMenu: {
    type: Boolean,
    default: false,
  },
  showCollect: {
    type: Boolean,
    default: false,
  },
  prompts: {
    type: Array,
    required: true,
    default: () => [],
  },
})

const localModelValue = computed({
  get: () => props.modelValue,
  set: value => {
    emits('update:modelValue', value)
    emits('onChange', value)
  },
})

// Auto focus
const refInput = ref(null)

// onMounted(() => {
//   refInput.value.focus()
//   setTimeout(() => {
//     refInput.value.select()
//   }, 100)
// })

const placeholderText = computed(() => {
  if (props.selectedText === '') return props.placeholder

  return `Or ask a question about “${props.selectedText}”`
})
const showSavePrompt = computed(() => {
  if (!props.showCollect) return false
  return props.prompts.every(v => v.command !== props.modelValue)
})

const handleSend = () => {
  if (props.disabled) return
  emits('onSubmit')
}
const handleFocus = () => {
  emits('onFocus')
}
const handleAddNewPrompt = () => {
  emits('onAddPrompt', props.modelValue)
}
</script>

<style lang="scss" module>
// .logo {
//   width: 16px;
//   height: 16px;
//   margin-right: 6px;
// }

.frame {
  padding: 8px 8px 0;

  // background-color: var(--webpilot-theme-main-background-color, #fff);
  // border-top-left-radius: 10px;
  // border-top-right-radius: 10px;
}

.container {
  display: flex;
  flex-direction: row;
  align-items: center;
  box-sizing: border-box;
  height: 36px;
  padding: 8px;
  background-color: var(--webpilot-theme-content-background-color, #fff);
  border: 1px solid var(--webpilot-theme-stoke-and-hover-status, #dcdee1);
  border-radius: 5px;

  &--unfold {
    border-bottom: 0;
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0;
  }
}

.input-area {
  flex: 1;
  width: 100% !important;
  max-width: none !important;
  height: 20px !important;
  color: var(--webpilot-theme-main-text-color, #292929);
  font-weight: 400 !important;
  font-size: 14px !important;
  font-style: normal !important;
  line-height: 20px !important;
  background-color: var(--webpilot-theme-content-background-color, #fff);
  border: none !important;

  &::placeholder {
    color: #929497;
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
  }

  &::selection {
    color: #fff;
    background: rgb(79 90 255 / 80%);
  }

  &:focus {
    outline: none !important;
    box-shadow: none !important;
  }

  &:placeholder-shown {
    text-overflow: ellipsis;
  }
}

.container__collect {
  margin-right: 12px;
}

.actionIcon {
  display: flex;
  cursor: pointer;
}

.promptInputDisabled {
  cursor: not-allowed;
}

.loading {
  cursor: not-allowed;
  animation: rotation 1s infinite linear;
}

@keyframes rotation {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(359deg);
  }
}
</style>

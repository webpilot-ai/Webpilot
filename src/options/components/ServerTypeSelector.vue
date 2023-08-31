<template>
  <div>
    <button
      :class="[$style['select-btn'], showOptions ? $style['select-btn-show-options'] : null]"
      @click="showDropdownMenu"
    >
      <div :class="$style['select-logo']">
        <currentLogo />
      </div>
      {{ SERVER_TYPE[modelValue] }}
      <IconCerat :class="$style['select-caret']" />
    </button>
    <div ref="elementOpenDropMenu" :class="$style['options-wrap']">
      <ul v-if="showOptions" :class="$style['select-options']">
        <li
          v-for="key in SERVER_NAME"
          :key="key"
          :class="$style['select-option']"
          @click="onOptionChange(key)"
        >
          <IconConfirmation
            :style="{
              visibility: modelValue === key ? null : 'hidden',
            }"
          />{{ SERVER_TYPE[key] }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {computed, ref} from 'vue'

import {onClickOutside} from '@vueuse/core'

import {SERVER_NAME, SERVER_TYPE} from '@/config'

import IconCerat from '../images/icon-caret.vue'
import IconLogoOpenai from '../images/icon-logo-openai.vue'
import IconLogoMicrosoft from '../images/icon-logo-microsoft.vue'
import IconConfirmation from '../images/icon-confirmation.vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: SERVER_NAME.OPENAI_OFFICIAL,
  },
})

const emits = defineEmits(['update:modelValue', 'change'])

const showOptions = ref(false)
const elementOpenDropMenu = ref(null)

onClickOutside(elementOpenDropMenu, () => {
  if (showOptions.value) {
    showOptions.value = false
  }
})

const showDropdownMenu = () => {
  if (showOptions.value === false) {
    showOptions.value = true
  }
}

const onOptionChange = value => {
  emits('change')
  emits('update:modelValue', value)
  showOptions.value = false
}

const currentLogo = computed(() => {
  if (
    props.modelValue === SERVER_NAME.OPENAI_OFFICIAL ||
    props.modelValue === SERVER_NAME.OPENAI_PROXY
  ) {
    return IconLogoOpenai
  }

  return IconLogoMicrosoft
})
</script>

<style lang="scss" module>
.select-btn {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  width: 360px;
  height: 36px;
  padding: 7px 8px;
  color: var(--color-baseline-text);
  background-color: white;
  border: 1px solid #dcdee1;
  border-radius: 5px;
  cursor: pointer;
}

.select-btn-show-options {
  border: 1px solid;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}

.options-wrap {
  position: relative;

  ul {
    position: absolute;
    top: 0;
    left: 0;
  }
}

.select-logo {
  margin-right: 8px;
}

.select-caret {
  margin-left: auto;
}

.select-options {
  box-sizing: border-box;
  width: 360px;
  margin: 0;
  padding: 0;
  color: var(--color-baseline-text);
  font-weight: 400;
  font-size: 14px;
  list-style: none;
  background-color: #fff;
  border: 1px solid var(--color-icon-default-and-secondary-text);
  border-top: none;
  border-bottom-right-radius: 5px;
  border-bottom-left-radius: 5px;
  box-shadow: 0 8px 24px 0 rgb(149 157 165 / 20%);
}

.select-option {
  display: flex;
  align-items: center;
  height: 36px;
  cursor: pointer;
}

.select-option:hover {
  background: linear-gradient(0deg, rgb(79 90 255 / 20%) 0%, rgb(79 90 255 / 20%) 100%), #fff;
}
</style>

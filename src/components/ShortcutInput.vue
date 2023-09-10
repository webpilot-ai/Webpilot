<script setup>
import {computed, ref} from 'vue'

import {formatShortcut} from '@/utils/index'

import {defaultConfig} from '@/config'

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => [],
  },
  showReset: {
    type: Boolean,
    default: true,
  },
})

const emits = defineEmits(['change', 'update:modelValue'])
const refInput = ref(null)
const text = ref('')
const isFocus = ref(false)
const keys = ref(props.modelValue)

let isKeydown = false

const formatedShortcut = computed(() => {
  const shortuctKeys = keys.value
  if (shortuctKeys.length === 0) return ''

  return formatShortcut(shortuctKeys)
})

const addKeys = e => {
  if (!isKeydown) {
    keys.value = []
  }

  isKeydown = true
  if (e.repeat) return
  keys.value.push(e.key)
}

const onKeyUp = () => {
  isKeydown = false
  refInput.value.addEventListener('keyup', onKeyUp)
}

const onFocus = () => {
  isFocus.value = true
  keys.value = []

  refInput.value.addEventListener('keydown', addKeys)
  refInput.value.addEventListener('keyup', onKeyUp)
}

const onBlur = () => {
  refInput.value.removeEventListener('keydown', addKeys)
  refInput.value.addEventListener('keyup', onKeyUp)
  isKeydown = false

  if (keys.value.length === 0) keys.value = props.modelValue

  text.value = ''
  isFocus.value = false

  if (props.modelValue.toString() === keys.value.toString) return
  emits('update:modelValue', keys.value)
  emits('change', keys.value)
}

const resetShortCut = () => {
  keys.value = defaultConfig.customShortcut
  emits('update:modelValue', keys.value)
  emits('change', keys.value)
}
</script>

<template>
  <section :class="$style.shortcutWrap">
    <input
      ref="refInput"
      v-model="text"
      :class="$style.shortcut"
      name="shortcut"
      :placeholder="formatedShortcut"
      type="text"
      @blur="onBlur"
      @focus="onFocus"
      @keydown="onPressShortcut"
    />
    <span v-if="isFocus" :class="$style.shortcutMask"> {{ formatedShortcut || 'Press Key' }}</span>
    <span v-if="showReset" :class="$style.reset" @click="resetShortCut">RESET</span>
  </section>
</template>

<style module lang="scss">
.shortcutWrap {
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  color: #585b58;
}

.reset {
  color: #585b58;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  cursor: pointer;
}

@media (prefers-color-scheme: dark) {
  .reset {
    color: #929497;
  }
}

.shortcut {
  box-sizing: border-box;
  width: 140px;
  height: 36px;
  margin-right: 8px;
  padding: 8px;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  border: 1px solid #929497;
  border-radius: 5px;
}

.shortcutMask {
  position: absolute;
  top: 8px;
  left: 8px;
  width: 124px;
  height: 20px;
  color: #585b58;
  font-weight: 400;
  font-size: 14px;
  font-style: normal;
  line-height: 20px;
  background-color: #fff;
}
</style>

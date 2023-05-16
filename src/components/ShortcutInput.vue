<script setup>
import {computed, ref} from 'vue'

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

const text = ref('')
const isFocus = ref(false)
const keys = ref(props.modelValue)

const formatedShortcut = computed(() => {
  let shortuctKeys = keys.value
  if (shortuctKeys.length === 0) return ''

  // optimize for diplay
  shortuctKeys = shortuctKeys.map(item => {
    if (item === 'Control') return 'Ctrl'
    return item.length === 1 ? item.toUpperCase() : item
  })

  return shortuctKeys.join('+')
})

const onFocus = () => {
  isFocus.value = true
  keys.value = []
}

const onBlur = () => {
  if (keys.value.length === 0) keys.value = props.modelValue

  text.value = ''
  isFocus.value = false

  if (props.modelValue.toString() === keys.value.toString) return
  emits('update:modelValue', keys.value)
  emits('change', keys.value)
}

const onPressShortcut = e => {
  if (e.repeat) return
  keys.value.push(e.key)
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
    <span v-if="showReset" :class="$style.reset" @click="resetShortCut">Reset</span>
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
  text-decoration: underline;
  cursor: pointer;
}

.shortcut {
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

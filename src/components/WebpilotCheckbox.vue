<template>
  <label :class="$style['checkbox-custom']">
    <div
      :class="[$style['checkbox-body'], {[$style['checkbox-body--activate']]: checked}]"
      @click="onClickCheckbox"
    >
      <IconCheckmark v-show="checked" />
    </div>
    <!-- <input v-model="checked" :class="$style.checkboxInput" type="checkbox" @change="onChange" /> -->
    <span v-if="label !== ''" :class="$style['checkbox-label']">{{ label }}</span>
  </label>
</template>

<script setup>
import {ref} from 'vue'

import IconCheckmark from './icon/IconCheckmark.vue'

const props = defineProps({
  modelValue: {
    required: true,
    type: Boolean,
    default: false,
  },
  label: {
    type: String,
    default: '',
  },
})

const checked = ref(props.modelValue)

const emits = defineEmits(['update:modelValue', 'change'])

const onClickCheckbox = () => {
  checked.value = !checked.value
  emits('update:modelValue', checked.value)
  emits('change', checked.value)
}

// const onChange = () => {
//   emits('update:modelValue', checked.value)
//   emits('change', checked.value)
// }
</script>

<style module lang="scss">
.checkbox-custom {
  display: flex;
  flex-direction: row;
  align-items: center;
  cursor: pointer;

  * {
    cursor: pointer;
  }
}

// .checkboxInput {
//   width: 16px;
//   height: 16px;
// }

// .checkboxInput:checked {
//   background-color: white;
// }

.checkbox-body {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border: 1px solid #dcdcdc;
  border-radius: 2px;
}

.checkbox-body--activate {
  border-color: #4f5aff;
}

.checkbox-label {
  margin-left: 6px;
  color: #585b58;
  font-size: 14px;
  line-height: 20px;
  user-select: none;
}
</style>

<template>
  <label :class="$style.webpilotCheckbox">
    <input v-model="checked" :class="$style.checkboxInput" type="checkbox" @change="onChaneg" />
    <span v-if="label !== ''" :class="$style.checkboxLabel">{{ label }}</span>
  </label>
</template>

<script setup>
import {ref} from 'vue'

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

const onChaneg = () => {
  emits('update:modelValue', checked.value)
  emits('change', checked.value)
}
</script>

<style module lang="scss">
.webpilotCheckbox {
  display: flex;
  flex-direction: row;
  align-items: center;
  cursor: pointer;

  * {
    cursor: pointer;
  }
}

.checkboxInput {
  width: 16px;
  height: 16px;
}

.checkboxInput:checked {
  background-color: white;
}

.checkboxLabel {
  margin-left: 6px;
  color: #585b58;
  font-size: 14px;
  line-height: 20px;
  user-select: none;
}
</style>

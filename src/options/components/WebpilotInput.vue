<template>
  <input
    v-model="value"
    :class="$style['webpilot-input']"
    :placeholder="placeholder"
    type="text"
    @change="onChange"
  />
</template>

<script setup lang="ts">
import {ref, watch} from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: '',
  },
})

const emits = defineEmits(['update:modelValue'])

const value = ref(props.modelValue)

const onChange = () => {
  emits('update:modelValue', value.value)
}

watch(
  () => props.modelValue,
  newValue => {
    value.value = newValue
  }
)
</script>

<style lang="scss" module>
.webpilot-input {
  box-sizing: border-box;
  width: 360px;
  height: 36px;
  padding: 8px;
  color: var(--color-baseline-text, #292929);
  font-weight: 400;
  font-size: 14px;
  background: #fff;
  border: 1px solid #dcdee1;
  border-radius: 5px;
}

.webpilot-input::placeholder {
  color: var(--label-text, #929497);
  font-weight: 400;
  font-size: 14px;
}
</style>

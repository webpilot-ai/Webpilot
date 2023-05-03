<template>
  <section :class="$style.promptInput">
    <input
      v-model="localModelValue"
      :class="$style.input"
      :placeholder="placeholder"
      type="text"
      @input="updateInputValue"
    />
    <IconSend :class="$style.actionIcon" />
  </section>
</template>

<script setup>
import {watch, ref} from 'vue'

import IconSend from './icon/IconSend.vue'

const emits = defineEmits(['update:modelValue', 'onChange'])

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: 'Ask a question about this webpage or anything',
  },
})

const localModelValue = ref(props.modelValue)

watch(
  () => props.modelValue,
  newValue => {
    localModelValue.value = newValue
  }
)

const updateInputValue = () => {
  emits('update:modelValue', localModelValue.value)
  emits('onChange')
}
</script>

<style lang="scss" module>
.promptInput {
  display: flex;
  flex-direction: row;
  align-items: center;
  box-sizing: border-box;
  height: 36px;
  border: 1px solid #dcdee1;
  border-radius: 5px;
}

.input {
  flex: 1;
  height: 20px;
  margin-left: 4px;
  font-weight: 400;
  font-size: 14px !important;
  font-style: normal;
  line-height: 20px;
  border: none;

  &::placeholder {
    color: #929497;
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
  }
}

.input:focus {
  outline: none;
}

.actionIcon {
  margin-right: 8px;
  cursor: pointer;
}
</style>

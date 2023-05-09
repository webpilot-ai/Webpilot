<template>
  <section :class="{[$style.promptInput]: true}">
    <input
      ref="refInput"
      v-model="localModelValue"
      :class="{[$style.input]: true, [$style.promptInputDisabled]: disabled}"
      :disabled="disabled"
      :placeholder="placeholderText"
      type="text"
      @input="updateInputValue"
      @keydown.enter="handleSend"
    />
    <section
      :class="{[$style.actionIcon]: true, [$style.promptInputDisabled]: disabled}"
      @click="handleSend"
    >
      <IconSend v-if="modelValue == ''" />
      <IconSendFill v-else />
    </section>
  </section>
</template>

<script setup>
import {watch, ref, computed, onMounted} from 'vue'

import IconSend from './icon/IconSend.vue'
import IconSendFill from './icon/IconSendFill.vue'

const emits = defineEmits(['update:modelValue', 'onChange', 'onSubmit'])

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: 'Ask a question about this webpage or anything',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  selectedText: {
    type: String,
    default: '',
  },
})

const refInput = ref(null)

const localModelValue = ref(props.modelValue)

onMounted(() => {
  refInput.value.focus()
})

const placeholderText = computed(() => {
  if (props.selectedText === '') {
    return props.placeholder
  }

  return `Or ask a question about “${props.selectedText}”`
})

const handleSend = () => {
  if (props.disabled) return
  emits('onSubmit')
}

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
  padding: 8px;
  border: 1px solid #dcdee1;
  border-radius: 5px;
}

.input {
  flex: 1;
  height: 20px;
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

  &:placeholder-shown {
    text-overflow: ellipsis;
  }

  &:disabled {
    background-color: #fff;
  }
}

.input:focus {
  outline: none;
}

.actionIcon {
  cursor: pointer;
}

.promptInputDisabled {
  cursor: not-allowed;
}
</style>

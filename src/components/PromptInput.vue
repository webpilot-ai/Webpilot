<template>
  <section :class="{[$style.promptInput]: true}">
    <input
      ref="refInput"
      v-model="localModelValue"
      :class="{[$style.input]: true, [$style.promptInputDisabled]: disabled}"
      :disabled="disabled"
      :placeholder="placeholderText"
      type="text"
      @keydown.enter="handleSend"
    />
    <section
      :class="{[$style.actionIcon]: true, [$style.promptInputDisabled]: disabled}"
      @click="handleSend"
    >
      <template v-if="!loading">
        <IconSend v-if="modelValue == ''" />
        <IconSendFill v-else />
      </template>
      <IconLoading v-else :class="$style.loading" />
    </section>
  </section>
</template>

<script setup>
import {ref, computed, onMounted} from 'vue'

import {$gettext} from '@/utils/i18n'

import IconSend from './icon/IconSend.vue'
import IconSendFill from './icon/IconSendFill.vue'
import IconLoading from './icon/IconLoading.vue'

const emits = defineEmits(['update:modelValue', 'onChange', 'onSubmit'])

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

onMounted(() => {
  refInput.value.focus()
  setTimeout(() => {
    refInput.value.select()
  }, 100)
})

const placeholderText = computed(() => {
  if (props.selectedText === '') return props.placeholder

  return `Or ask a question about “${props.selectedText}”`
})

const handleSend = () => {
  if (props.disabled) return
  emits('onSubmit')
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
  height: 20px !important;
  font-weight: 400 !important;
  font-size: 14px !important;
  font-style: normal !important;
  line-height: 20px !important;
  border: none !important;

  &::placeholder {
    color: #929497;
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
  }

  &:focus {
    outline: none !important;
    box-shadow: none !important;
  }

  &:placeholder-shown {
    text-overflow: ellipsis;
  }

  &:disabled {
    background-color: #fff;
  }
}

.actionIcon {
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

<template>
  <div :class="$style['credit-radio-group']">
    <div :class="$style['radio-wrap']">
      <input
        id="webpilot"
        v-model="picked"
        :class="$style['input-radio']"
        type="radio"
        :value="CREDIT_SOURCES.WEBPILOT"
        @change="onChange"
      />
      <label
        :class="picked !== CREDIT_SOURCES.WEBPILOT || $style['radio-activated']"
        for="webpilot"
      >
        Webpilot Credit
      </label>
    </div>
    <div :class="$style['radio-wrap']">
      <input
        id="openai"
        v-model="picked"
        :class="$style['input-radio']"
        type="radio"
        :value="CREDIT_SOURCES.OPENAI"
        @change="onChange"
      />
      <label :class="picked !== CREDIT_SOURCES.OPENAI || $style['radio-activated']" for="openai">
        Open AI Credits
      </label>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, watch} from 'vue'

const CREDIT_SOURCES = {
  WEBPILOT: 'webpilot',
  OPENAI: 'openAI',
}

const props = defineProps({
  modelValue: {
    type: String,
    default: 'webpilot',
  },
})

const emits = defineEmits(['update:modelValue', 'change'])

const picked = ref(props.modelValue)

const onChange = () => {
  emits('update:modelValue', picked.value)
  emits('change')
}

watch(
  () => props.modelValue,
  newValue => {
    picked.value = newValue
  }
)
</script>

<style lang="scss" module>
.credit-radio-group {
  display: grid;
  grid-template-columns: 1fr 1fr;
  color: var(--color-baseline-text);
  font-weight: 400;
  font-size: 14px;
}

.radio-wrap {
  display: flex;
  align-items: center;

  * {
    cursor: pointer;
  }
}

.radio-activated {
  font-weight: 600;
}

.input-radio {
  width: 16px;
  height: 16px;
  margin: 0;
  margin-right: 8px;
}
</style>

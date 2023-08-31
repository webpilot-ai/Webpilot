<template>
  <div :class="$style['credit-radio-group']">
    <div :class="$style['radio-wrap']">
      <input
        id="webpilot"
        v-model="picked"
        :class="$style['input-radio']"
        type="radio"
        :value="OPTIONS.webpilot"
        @change="onChange"
      />
      <label :class="picked !== OPTIONS.webpilot || $style['radio-activated']" for="webpilot">
        Webpilot Credit
      </label>
    </div>
    <div :class="$style['radio-wrap']">
      <input
        id="openai"
        v-model="picked"
        :class="$style['input-radio']"
        type="radio"
        :value="OPTIONS.openai"
        @change="onChange"
      />
      <label :class="picked !== OPTIONS.openai || $style['radio-activated']" for="openai">
        Open AI Credits
      </label>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref} from 'vue'

const OPTIONS = {
  webpilot: 'webpilot',
  openai: 'openAI',
}

const props = defineProps({
  modelValue: {
    type: String,
    default: 'webpilot',
  },
})

const emits = defineEmits(['update:modelValue'])

const picked = ref(props.modelValue)

const onChange = () => {
  emits('update:modelValue', picked.value)
}
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

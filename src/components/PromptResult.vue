<template>
  <section v-show="showResult" :class="$style.promptResultWrap">
    <section>Webpilot says</section>
    <textarea ref="refTextarea" :class="$style.textarea" readonly :value="result" />
    <section :class="$style.btnArea">
      <section :class="$style.tips">Amazing Webpilot, telling friends!</section>
      <WebpilotButton :class="$style.copyBtn" value="COPY" @click="handleCopy" />
    </section>
  </section>
</template>

<script setup>
import {ref, watch, computed} from 'vue'

import copyToClipboard from 'copy-to-clipboard'

import WebpilotButton from './WebpilotButton.vue'

const refTextarea = ref(null)

const props = defineProps({
  result: {
    type: String,
    default: '',
  },
})

const showResult = computed(() => {
  return props.result !== ''
})

const result = computed(() => props.result)

watch(result, () => {
  refTextarea.value.scrollTop = refTextarea.value.scrollHeight
})

const handleCopy = () => {
  const text = props.result
  copyToClipboard(text)
}
</script>

<style lang="scss" module>
.promptResultWrap {
  display: flex;
  flex-direction: column;
  align-items: start;
  margin-top: 16px !important;
  color: #292929;
  font-weight: 500;
  font-size: 12px;
  line-height: 20px;
}

.textarea {
  width: 448px;
  height: 116px;
  margin-top: 4px;
  padding: 8px;
  color: #000;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  border: 1px solid #dcdee1;
  border-radius: 5px;
  resize: none;

  &:focus-visible {
    outline: none;
  }
}

.btnArea {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  margin-top: 8px !important;
}

.tips {
  color: #929497;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  text-decoration: underline;
  cursor: pointer;
  user-select: none;
  text-decoration-line: underline;
}

.copyBtn {
  margin-left: auto !important;
}
</style>

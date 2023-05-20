<template>
  <section v-show="showResult" :class="$style.promptResultWrap">
    <section>Webpilot says</section>
    <textarea
      ref="refTextarea"
      :class="$style.textarea"
      readonly
      :value="result"
      @scroll="onScroll"
    />
    <section :class="$style.btnArea">
      <section :class="$style.tips" @click="showShareInfo">
        Amazing Webpilot, telling friends!
      </section>
      <WebpilotButton :class="$style.copyBtn" value="COPY" @click="handleCopy" />
    </section>
  </section>
</template>

<script setup>
import {ref, watch, computed} from 'vue'

import copyToClipboard from 'copy-to-clipboard'
import {useToast} from 'vue-toast-notification'

import WebpilotButton from './WebpilotButton.vue'

const refTextarea = ref(null)
const isAutoScroll = ref(true)

const toast = useToast()

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
})

const emits = defineEmits(['update:modelValue'])

let oldScrollTop = null
let textareaLineHeight = null

const onScroll = () => {
  if (textareaLineHeight === null) {
    const styleLineHeight = window.getComputedStyle(refTextarea.value)?.lineHeight
    textareaLineHeight = parseFloat(styleLineHeight)
  }

  const {scrollTop: currentScrollTop, scrollHeight, clientHeight} = refTextarea.value

  // scroll up stop auto scroll
  if (isAutoScroll.value && oldScrollTop !== null && currentScrollTop < oldScrollTop) {
    isAutoScroll.value = false
  }

  // scroll to bottom start auto scroll
  if (
    !isAutoScroll.value &&
    !isAutoScroll.value &&
    scrollHeight - (currentScrollTop + clientHeight) <= textareaLineHeight / 2
  ) {
    isAutoScroll.value = true
  }

  oldScrollTop = currentScrollTop
}

const showResult = computed(() => {
  return !!props.modelValue && props.modelValue !== ''
})

watch(showResult, v => {
  /** Reset auto scroll */
  if (!v) isAutoScroll.value = true
})

const result = computed(() => props.modelValue)

const showShareInfo = () => {
  emits(
    'update:modelValue',
    `Let me tell you about this crazy useful AI tool called Webpilot. All you gotta do is swipe on the task, and it gets done automatically. It's way better than ChatGPT, trust me!\n\nInstall: https://bit.ly/3mAJ9I7\nGitHub: https://github.com/webpilot-ai/Webpilot`
  )
  refTextarea.value.scrollTop = refTextarea.value.scrollHeight
}

watch(result, () => {
  if (!isAutoScroll.value) return

  refTextarea.value.scrollTop = refTextarea.value.scrollHeight
})

const handleCopy = () => {
  const text = props.modelValue
  const isSuccessCopy = copyToClipboard(text)
  toast.open({
    message: isSuccessCopy ? 'Copy success!' : 'Copy Failed',
    type: isSuccessCopy ? 'success' : 'error',
    position: 'top',
  })
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

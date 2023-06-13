<template>
  <section v-show="showResult" :class="$style.promptResultWrap">
    <section>Webpilot says</section>
    <div ref="refMarkdown" :class="$style.markdownWrap" @scroll="onScroll">
      <Markdown :source="result" />
    </div>
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
import Markdown from 'vue3-markdown-it'
// eslint-disable-next-line import/no-unresolved
import 'highlight.js/styles/monokai.css'

import WebpilotButton from './WebpilotButton.vue'

const refMarkdown = ref(null)
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
    const styleLineHeight = window.getComputedStyle(refMarkdown.value)?.lineHeight
    textareaLineHeight = parseFloat(styleLineHeight)
  }

  const {scrollTop: currentScrollTop, scrollHeight, clientHeight} = refMarkdown.value

  // scroll up stop auto scroll
  if (isAutoScroll.value && oldScrollTop !== null && currentScrollTop < oldScrollTop) {
    isAutoScroll.value = false
  }

  // scroll to bottom start auto scroll
  if (
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
  refMarkdown.value.scrollTop = refMarkdown.value.scrollHeight
}

watch(result, () => {
  if (!isAutoScroll.value) return

  refMarkdown.value.scrollTop = refMarkdown.value.scrollHeight
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

.markdownWrap {
  width: 448px;
  height: 116px;
  margin-top: 4px;
  padding: 8px;
  overflow-x: hidden;
  overflow-y: auto;
  color: #000;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  text-align: left;
  border: 1px solid #dcdee1;
  border-radius: 5px;
  resize: none;

  &:focus-visible {
    outline: none;
  }

  &:focus {
    border-color: #dcdee1;
    outline: none;
  }

  * {
    font-size: 14px;
  }

  p {
    margin: 0;
  }

  pre {
    margin: 0.5rem 0;
    padding: 0;
  }

  code {
    padding: 0.5rem !important;
    border-radius: 5px;
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

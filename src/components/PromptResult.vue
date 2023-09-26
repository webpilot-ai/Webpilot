<template>
  <section v-show="showResult" :class="$style.promptResultWrap">
    <!-- <section>Webpilot says</section> -->
    <div ref="refMarkdown" :class="$style.markdownWrap" @scroll="onScroll">
      <Markdown :source="result" />
    </div>
    <article :class="$style.footer">
      <!-- <section :class="$style.tips" @click="showShareInfo">
        Amazing Webpilot, telling friends!
      </section> -->
      <!-- <section v-if="isCopied" :class="$style.copySuccess">
        <IconCheckmark></IconCheckmark>
        {{ copyResult }}
      </section>
      <WebpilotButton :class="$style.copyBtn" value="COPY" @click="handleCopy" /> -->
      <TipsShortcut :class="$style.shortcut" />
      <section :class="$style.copyControl">
        <IconCopiedDone v-if="isCopied" :class="$style.copyBtn" value="COPY" @click="handleCopy" />
        <IconCopyAvailable v-else :class="$style.copyBtn" value="COPY" @click="handleCopy" />
        <WebpilotAttribution />
      </section>
    </article>
  </section>
</template>

<script setup>
import {ref, watch, computed} from 'vue'

import copyToClipboard from 'copy-to-clipboard'
// import {useToast} from 'vue-toast-notification'
import Markdown from 'vue3-markdown-it'
// eslint-disable-next-line import/no-unresolved
import 'highlight.js/styles/monokai.css'

// import WebpilotButton from './WebpilotButton.vue'
// import IconCheckmark from './icon/IconCheckmark.vue'
import IconCopyAvailable from './icon/IconCopyAvailable.vue'
import IconCopiedDone from './icon/IconCopiedDone.vue'
import TipsShortcut from './TipsShortcut.vue'
import WebpilotAttribution from './WebpilotAttribution.vue'

const refMarkdown = ref(null)
const isAutoScroll = ref(true)
const isCopied = ref(false)
const copyResult = ref('')

// const toast = useToast()

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
})

// const emits = defineEmits(['update:modelValue'])

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

// const showShareInfo = () => {
//   emits(
//     'update:modelValue',
//     `Let me tell you about this crazy useful AI tool called Webpilot. All you gotta do is swipe on the task, and it gets done automatically. It's way better than ChatGPT, trust me!\n\nInstall: https://bit.ly/3mAJ9I7\nGitHub: https://github.com/webpilot-ai/Webpilot`
//   )
//   refMarkdown.value.scrollTop = refMarkdown.value.scrollHeight
// }

watch(result, () => {
  if (!isAutoScroll.value) return

  refMarkdown.value.scrollTop = refMarkdown.value.scrollHeight
})

const handleCopy = () => {
  const text = props.modelValue
  const isSuccessCopy = copyToClipboard(text)

  isCopied.value = true
  setTimeout(() => {
    isCopied.value = false
  }, 3000)

  if (isSuccessCopy) {
    copyResult.value = 'Copied'
  } else {
    copyResult.value = 'Copy Failed'
  }

  // toast.open({
  //   message: isSuccessCopy ? 'Copy success!' : 'Copy Failed',
  //   type: isSuccessCopy ? 'success' : 'error',
  //   position: 'top',
  // })
}
</script>

<style lang="scss" module>
.promptResultWrap {
  display: flex;
  flex-direction: column;
  align-items: start;

  // margin-top: 16px !important;
  margin-top: 8px;
  color: #292929;
  font-weight: 500;
  font-size: 12px;
  line-height: 20px;
}

.markdownWrap {
  // width: 448px;
  width: 596px;
  height: 116px;

  // margin-top: 4px;
  padding: 8px;
  overflow-x: hidden;
  overflow-y: auto;
  color: #000;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  text-align: left;

  // border: 1px solid #dcdee1;
  background-color: #f8f8f8;
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
    background-color: #272822;
  }

  code {
    // padding: 0.5rem !important;
    padding: 0 5px;
    border-radius: 5px;

    &:not([class]) {
      background-color: #dcdcdc;
    }
  }
}

.footer {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-top: 8px !important;
}

.copyControl {
  display: flex;
  align-content: center;
}

.copyBtn {
  width: 24px;
  height: 24px;
  transform: translate(140px, -35px);
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

.copySuccess {
  display: flex;
  gap: 6px;
  align-items: center;
  margin: 0 8px 0 auto;
  color: #292929;
  font-weight: 600;

  svg {
    width: 16px;
    height: 16px;
    background: #318619;
    border-radius: 50%;
  }
}
</style>

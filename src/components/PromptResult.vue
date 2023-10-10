<template>
  <section v-show="showResult" :class="$style.container">
    <!-- <section>Webpilot says</section> -->
    <div ref="refMarkdown" :class="$style.container__content" @scroll="onScroll">
      <Markdown :source="result" />
    </div>
    <article :class="$style.container__footer">
      <!-- <section :class="$style.tips" @click="showShareInfo">
        Amazing Webpilot, telling friends!
      </section> -->
      <!-- <section v-if="isCopied" :class="$style.copySuccess">
        <IconCheckmark></IconCheckmark>
        {{ copyResult }}
      </section>
      <WebpilotButton :class="$style.copyBtn" value="COPY" @click="handleCopy" /> -->
      <TipsShortcut />
      <section :class="$style.control">
        <article :class="$style['control-move']" @mousedown="onDragStart">
          <p :class="$style['control-move__bar']"></p>
        </article>
        <IconCopiedDone
          v-if="isCopied"
          :class="$style['control__copy-btn']"
          value="COPY"
          @click="handleCopy"
        />
        <IconCopyAvailable
          v-else
          :class="$style['control__copy-btn']"
          value="COPY"
          @click="handleCopy"
        />
        <WebpilotAttribution />
      </section>
    </article>
    <aside v-if="showShadow" :class="$style.container__shadow" />
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
  showShadow: {
    type: Boolean,
    default: false,
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
  const isSuccessCopy = copyToClipboard(text, {format: 'text/plain'})

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

let isDragging = false
let startY = 0
let startHeight = 0

const onDragStart = event => {
  isDragging = true
  startY = event.clientY
  startHeight = refMarkdown.value.offsetHeight
  window.addEventListener('mousemove', onDragMove)
  window.addEventListener('mouseup', onDragEnd)
}

const onDragMove = event => {
  if (!isDragging) return
  const deltaY = event.clientY - startY
  const newHeight = startHeight + deltaY
  if (newHeight < 226) return
  // if (newHeight < 116) return
  if (newHeight > window.innerHeight * 0.8) return
  refMarkdown.value.style.height = `${newHeight}px`
}

const onDragEnd = () => {
  isDragging = false
  window.removeEventListener('mousemove', onDragMove)
  window.removeEventListener('mouseup', onDragEnd)
}
</script>

<style lang="scss" module>
.container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: start;

  // margin-top: 8px;
  // padding: 0 8px 8px;
  padding: 8px;
  color: #292929;
  font-weight: 500;
  font-size: 12px;
  line-height: 20px;
  background-color: var(--webpilot-theme-main-background-color, #fff);
  border-radius: 10px;
}

.container__shadow {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgb(0 0 0 / 50%);
  border-bottom-right-radius: 10px;
  border-bottom-left-radius: 10px;
  backdrop-filter: blur(2px);
}

.container__content {
  width: 596px;

  // height: 116px;
  height: 226px;
  padding: 8px;
  overflow-x: hidden;
  overflow-y: auto;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  text-align: left;
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
    color: #000;
    line-height: 1.6;
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

.container__footer {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-top: 8px !important;
  user-select: none;
}

.control {
  display: flex;
}

.control-move {
  margin-right: 72px;
  padding: 9px 0;
  cursor: row-resize;

  & .control-move__bar {
    width: 120px;
    height: 6px;
    margin: 0;
    background-color: #dcdee1;
    border-radius: 20px;
  }
}

.control__copy-btn {
  width: 24px;
  height: 24px;
  transform: translate(140px, -35px);
  cursor: pointer;
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

// .copySuccess {
//   display: flex;
//   gap: 6px;
//   align-items: center;
//   margin: 0 8px 0 auto;
//   color: #292929;
//   font-weight: 600;

//   svg {
//     width: 16px;
//     height: 16px;
//     background: #318619;
//     border-radius: 50%;
//   }
// }
</style>

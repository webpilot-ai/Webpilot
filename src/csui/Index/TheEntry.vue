<template>
  <section
    v-if="isShowWebpilotTail"
    ref="refTail"
    :class="$style.webpilotTail"
    :style="{
      top: `${tailPosition.y}px`,
      left: `${tailPosition.x}px`,
    }"
    @click="handleMouseOverTail"
  >
    <img :class="$style.webpilotLogo" :src="WebpilotLogo" />
    <span>{{ shortcutText }}</span>
  </section>

  <section
    v-if="showWebpilotPopup"
    ref="refPopupWrap"
    :class="$style.popupBoxContainer"
    :style="{
      top: `${popupPosition.y}px`,
      left: `${popupPosition.x}px`,
      transform: `translate(${dragOffsetX}px, ${dragOffsetY}px)`,
    }"
  >
    <ThePopupBox id="webpilot_popup" :is-ask-page="isAskPage" @close-popup="handleClosePopup" />
    <section ref="refDragHandle" :class="$style.dragHandle"></section>
  </section>

  <!-- <section :class="$style.sidebarContainer">
    <TheSidebar />
  </section> -->
</template>

<script setup>
import {computed, ref, watch} from 'vue'
import '@assets/styles/csui-reset.scss'

import {onClickOutside, useMagicKeys} from '@vueuse/core'

// eslint-disable-next-line import/no-unresolved
import WebpilotLogo from 'data-base64:~assets/icon.png'

import {MESSAGING_EVENT} from '@/config'

import useScroll from '@/hooks/useScroll'
import useDraggable from '@/hooks/useDraggable'
import useMessage from '@/hooks/useMessage'
import useSelectedText from '@/hooks/useSelectedText'
import useStopKeyboardEvent from '@/hooks/useStopKeyboardEvent'

import useStore from '@/stores/store'
import {formatShortcut} from '@/utils'

// import WebpilotLogo from '../data-base64:~assets/icon.png'

import ThePopupBox from './ThePopupBox/ThePopupBox.vue'

/** For listen scroll Y offset */
const refTail = ref(null)

/** For listen click outside */
const refPopupWrap = ref(null)

/** For listen drag  X Y offset */
const refDragHandle = ref(null)

/** Popup state trigger by mouse over logo(tail) */
const showWebpilotPopup = ref(false)

/** Store for not config */
const store = useStore()

/** Mouse up and Ctrl+A text position */
const position = ref({x: 0, y: 0})

/** Select selct by keyboard or mouse */
const selectedText = ref('')

/** Identify popup type */
const isAskPage = computed(() => {
  return selectedText.value === '' && !selectedText.value
})

const isShowWebpilotTail = computed(() => {
  if (!store.config.isAuth) return false

  // Hiden when popup show
  if (showWebpilotPopup.value) return false

  return showWebpilotTail.value && store.config.autoPopup
})

const targetElementRef = ref(null)

/** Get text and position from mouse and keybaord select text */
const updateTextAndPosition = textAndPosition => {
  if (showWebpilotPopup.value) return

  const {selectedText: text, position: currentPosition} = textAndPosition
  selectedText.value = text
  store.setSelectedText(text)
  position.value = currentPosition

  // update selected element
  const {targetElement: target} = textAndPosition
  targetElementRef.value = text ? target.value : null

  // reset scroll data when continuously select text
  if (showWebpilotTail.value) resetScroll()
}

useSelectedText(updateTextAndPosition)

const {offsetY: tailScrollYOffset, resetScroll} = useScroll(refTail, targetElementRef)
const {offsetX: dragOffsetX, offsetY: dragOffsetY, resetDrag} = useDraggable(refDragHandle)

// keyboard
const keys = useMagicKeys()
const shortcut = keys[store.config.customShortcut.join('+')]
watch(shortcut, v => {
  if (!v) return

  // Not key not popup
  if (!store.config.isAuth) return

  // Hit shortcut twice close popup
  if (showWebpilotPopup.value) {
    handleClosePopup()
    return
  }

  showWebpilotPopup.value = true

  // show popup by shortcut remove shortkey tips
  if (store.config.showShortcutTips) {
    store.updateConfig({
      showShortcutTips: false,
    })
  }
})

// prevent keyboard event pass overlay ui
useStopKeyboardEvent(refPopupWrap)

// Messaging
useMessage(req => {
  if (req.name === MESSAGING_EVENT.SHOW_POPUP) {
    showWebpilotPopup.value = true
  }
})

// trigger by click icon

const onClickPopupOutside = () => {
  // if is askpage (popup without select text), ingore click outside
  if (isAskPage.value) return

  selectedText.value = ''
  handleClosePopup()
}

onClickOutside(refPopupWrap, onClickPopupOutside)

const showWebpilotTail = computed(() => {
  if (!store.config.autoPopup) return false
  return selectedText.value !== '' && !showWebpilotPopup.value
})

const handleClosePopup = () => {
  showWebpilotPopup.value = false
  store.$patch({selectedText: ''})
  // remove tail
  selectedText.value = ''
  // clean drag position
  resetDrag()
}

const handleMouseOverTail = () => {
  showWebpilotPopup.value = true
}

const tailPosition = computed(() => {
  const TAIL_X_OFFEST = 0
  const TAIL_Y_OFFSET = 9

  let {x, y} = position.value

  // scroll offset
  y = y + tailScrollYOffset.value

  x = x + TAIL_X_OFFEST
  y = y + TAIL_Y_OFFSET

  return {x, y}
})

const popupPosition = computed(() => {
  const x = window.innerWidth / 2 - 480 / 2
  const y = 50
  return {x, y}
})

const shortcutText = computed(() => {
  return formatShortcut(store.config.customShortcut)
})
</script>

<style lang="scss" module>
@mixin popup {
  position: fixed;
  z-index: 99999999999;
  text-align: center;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 6px rgb(0 0 0 / 30%);
}

.popupBoxContainer {
  @include popup;

  position: fixed;
  top: 10%;
  left: 2%;
  width: 480px;
}

.sidebarContainer {
  @include popup;

  top: 10%;
  right: 0;
  width: 200px;
  height: 500px;
}

.webpilotTail {
  @include popup;

  display: flex;
  align-items: center;
  height: 28px;
  padding: 6px;
  color: #292922;
  font-weight: 500;
  font-size: 12px;
  border: 1px solid rgb(79 90 255 / 10%);

  /* line-height: 17px; */
  border-radius: 10px;
  box-shadow: 0 5px 15px 0 rgb(0 0 0 / 8%), 0 2px 4px 0 rgb(0 0 0 / 11%);
  cursor: pointer;

  img {
    width: 16px;
    height: 16px;
    margin-right: 4px;
  }
}

.webpilotTail:hover {
  color: #4f5aff;

  img {
    background-color: rgb(79 90 255 / 20%);
    border-radius: 3px;
  }
}

.webpilotLogo {
  display: block;
  width: 24px;
  height: 24px;
  background-color: #fff;
}

.dragHandle {
  position: absolute;
  top: 0;
  left: 140px;
  width: 200px;
  height: 36px;
  cursor: move;
  user-select: none;
}
</style>

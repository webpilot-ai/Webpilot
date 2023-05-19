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
  </section>

  <section
    v-if="isShowWebpilotPopup"
    ref="refPopupWrap"
    :class="$style.popupBoxContainer"
    :style="{
      top: `${popupPosition.y}px`,
      left: `${popupPosition.x}px`,
      transform: `translate(${dragOffsetX}px, ${dragOffsetY}px)`,
    }"
  >
    <ThePopupBox id="webpilot_popup" :is-ask-page="isShowAskPage" @close-popup="handleClosePopup" />
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

import {MESSAGING_EVENT} from '@/config'

import useScroll from '@/hooks/useScroll'
import useDraggable from '@/hooks/useDraggable'
import useMessage from '@/hooks/useMessage'
import useMouseSelectedText from '@/hooks/useMouseSelectedText'
import useKeyboardSelectedText from '@/hooks/useKeyboardSelectedText'

import useStore from '@/stores/store'
import useConfigStore from '@/stores/config'

import WebpilotLogo from '../../../assets/icon.png'

import ThePopupBox from './ThePopupBox/ThePopupBox.vue'

/** For listen scroll Y offset */
const refTail = ref(null)

/** For listen scrolll Y offset */
const refPopupWrap = ref(null)

/** For listen drag  X Y offset */
const refDragHandle = ref(null)

/** Identify popup type */
const isShowAskPage = ref(false)

/** Popup state trigger by mouse over logo(tail) */
const showWebpilotPopup = ref(false)

/** Store for not config */
const store = useStore()

/** Store for config */
const storeConfig = useConfigStore()

/** Mouse up and Ctrl+A text position */
const position = ref({x: 0, y: 0})

/** Select selct by keyboard or mouse */
const selectedText = ref('')

/** Show popup or not */
const isShowWebpilotPopup = computed(() => {
  return showWebpilotPopup.value || isShowAskPage.value
})

const isShowWebpilotTail = computed(() => {
  if (!storeConfig.config.isAuth) return false
  return showWebpilotTail.value && storeConfig.config.autoPopup
})

/** Get text and position from mouse and keybaord select text */
const updateTextAndPosition = textAndPosition => {
  if (isShowWebpilotPopup.value) return

  const {selectedText: text, position: currentPosition} = textAndPosition
  selectedText.value = text
  store.setSelectedText(text)
  position.value = currentPosition
}

useMouseSelectedText(updateTextAndPosition)
useKeyboardSelectedText(updateTextAndPosition)

const {scrollYOffset: popupScrollYOffset} = useScroll(refPopupWrap)
const {scrollYOffset: tailScrollYOffset} = useScroll(refTail)
const {offsetX: dragOffsetX, offsetY: dragOffsetY, resetDrag} = useDraggable(refDragHandle)

// keyboard
const keys = useMagicKeys()
const shortcut = keys[storeConfig.config.customShortcut.join('+')]
watch(shortcut, v => {
  if (v && !showWebpilotPopup.value) {
    // Hit shortcut twice close popup
    if (isShowAskPage.value) {
      handleClosePopup()
      return
    }

    showAskPage()

    // show popup by shortcut remove shortkey tips
    if (storeConfig.config.showShortcutTips) {
      storeConfig.setShowShortcutTips(false)
    }
  }
})

// Messaging
useMessage(req => {
  if (req.name === MESSAGING_EVENT.SHOW_POPUP) {
    showAskPage()
  }
})

const showAskPage = () => {
  isShowAskPage.value = true
}

const onClickPopupOutside = () => {
  if (isShowAskPage.value) return

  selectedText.value = ''
  handleClosePopup()
}

onClickOutside(refPopupWrap, onClickPopupOutside)

const showWebpilotTail = computed(() => {
  if (!storeConfig.config.autoPopup) return false
  return selectedText.value !== '' && !showWebpilotPopup.value
})

const handleClosePopup = () => {
  isShowAskPage.value = false
  showWebpilotPopup.value = false
  store.cleanResult()
  // remove tail
  selectedText.value = ''
  // clean drag position
  resetDrag()
}

const handleMouseOverTail = () => {
  showWebpilotPopup.value = true
}

const tailPosition = computed(() => {
  const TAIL_X_OFFEST = 25
  const TAIL_Y_OFFSET = 0

  let {x, y} = position.value

  // scroll offset
  y = y + tailScrollYOffset.value

  x = x + TAIL_X_OFFEST
  y = y + TAIL_Y_OFFSET

  return {x, y}
})

const popupPosition = computed(() => {
  if (isShowAskPage.value) {
    const x = window.innerWidth / 2 - 480 / 2
    const y = 50
    return {x, y}
  }

  const POPUP_X_MIDDLE = 240
  const POPUP_Y_OFFSET = 0
  const EDGE_OFFSET = 20

  let {x, y} = position.value

  // check left
  const minX = POPUP_X_MIDDLE + EDGE_OFFSET
  if (x < minX) x = minX

  // check right
  const maxX = window.innerWidth - POPUP_X_MIDDLE - EDGE_OFFSET
  if (x > maxX) x = maxX

  // scroll offset
  y = y + popupScrollYOffset.value + tailScrollYOffset.value

  // move to center offset
  x = x - POPUP_X_MIDDLE
  y = y + POPUP_Y_OFFSET

  return {x, y}
})
</script>

<style lang="scss" module>
@mixin popup {
  position: fixed;
  z-index: 99999999999;
  overflow: hidden;
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

  width: 24px;
  height: 24px;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgb(0 0 0 / 30%);
  cursor: pointer;
  opacity: 0.85;
}

.webpilotLogo {
  display: block;
  width: 24px;
  height: 24px;
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

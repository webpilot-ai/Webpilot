<template>
  <section
    v-if="showWebpilotTail"
    ref="refTail"
    :class="$style.webpilotTail"
    :style="{
      top: `${tailPosition.y}px`,
      left: `${tailPosition.x}px`,
    }"
    @mouseover="handleMouseOverTail"
  >
    <img :class="$style.webpilotLogo" :src="WebpilotLogo" />
  </section>

  <section
    :class="$style.popupBoxContainer"
    :style="{
      top: `${popupPosition.y}px`,
      left: `${popupPosition.x}px`,
    }"
  >
    <ThePopupBox
      v-if="showWebpilotPopup"
      id="webpilot_popup"
      ref="refPopup"
      @close-popup="handleClosePopup"
    />
  </section>

  <!-- <section :class="$style.sidebarContainer">
    <TheSidebar />
  </section> -->
</template>

<script setup>
import {computed, ref, watch} from 'vue'
import '@assets/styles/csui-reset.scss'

import useSelectedText from '@/hooks/useSelecctedText'
import useClickOutside from '@/hooks/useClickoutside'
import useScroll from '@/hooks/useScroll'
import useStore from '@/stores/store'

import WebpilotLogo from '../../../assets/icon.png'

import ThePopupBox from './ThePopupBox/ThePopupBox.vue'

const refTail = ref(null)
const refPopup = ref(null)
const showWebpilotPopup = ref(false)

const store = useStore()
const {selectedText, mouseUpPosition} = useSelectedText(showWebpilotPopup)
const {scrollYOffset: popupScrollYOffset} = useScroll(refPopup)
const {scrollYOffset: tailScrollYOffset} = useScroll(refTail)

const onClickPopupOutside = () => {
  selectedText.value = ''
  handleClosePopup()
}

useClickOutside(refPopup, onClickPopupOutside)

const showWebpilotTail = computed(() => {
  return selectedText.value !== '' && !showWebpilotPopup.value
})

watch(selectedText, newValue => {
  store.setSelectedText(newValue)
})

const handleClosePopup = () => {
  showWebpilotPopup.value = false
  store.cleanResult()
}

const handleMouseOverTail = () => {
  showWebpilotPopup.value = true
}

const tailPosition = computed(() => {
  const TAIL_X_OFFEST = 25
  const TAIL_Y_OFFSET = 0

  let {x, y} = mouseUpPosition

  // scroll offset
  y = y + tailScrollYOffset.value

  x = x + TAIL_X_OFFEST
  y = y + TAIL_Y_OFFSET

  return {x, y}
})

const popupPosition = computed(() => {
  const POPUP_X_MIDDLE = 240
  const POPUP_Y_OFFSET = 0
  const EDGE_OFFSET = 20

  let {x, y} = mouseUpPosition

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
</style>

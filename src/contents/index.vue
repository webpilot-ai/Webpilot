<template>
  <section :class="$style.popupBoxContainer">
    <ThePopupBox />
  </section>

  <section :class="$style.sidebarContainer">
    <TheSidebar />
  </section>
</template>

<script>
import '@assets/styles/csui-reset.scss'

import ThePopupBox from '@/csui/ThePopupBox/ThePopupBox.vue'
import TheSidebar from '@/csui/TheSidebar/TheSidebar.vue'

export default {
  plasmo: {getRootContainer},
  components: {ThePopupBox, TheSidebar},
  setup() {},
  mounted() {},
}

export const config = {
  matches: ['<all_urls>'],
}

async function getRootContainer() {
  const [$html] = document.getElementsByTagName('html')

  if (!$html) return null

  const $rootContainer = document.createElement('div')
  $rootContainer.setAttribute('id', 'webpilot-container')
  $html.append($rootContainer)
  return $rootContainer
}
</script>

<style lang="scss" module>
@mixin popup {
  position: fixed;
  z-index: 99999999999;
  overflow: hidden;
  line-height: 100px;
  text-align: center;
  background-color: #f00;
  border-radius: 10px;
  box-shadow: 0 2px 6px rgb(0 0 0 / 30%);
}

.popupBoxContainer {
  @include popup;

  position: fixed;
  top: 10%;
  left: 2%;
  width: 200px;
  height: 100px;
}

.sidebarContainer {
  @include popup;

  top: 10%;
  right: 0;
  width: 200px;
  height: 500px;
}
</style>

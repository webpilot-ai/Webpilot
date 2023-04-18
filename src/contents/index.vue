<template>
  <section :class="$style.container">
    <ThePopupBox />
  </section>
</template>

<script>
import '@assets/styles/csui-reset.scss'

import ThePopupBox from '@/views/ThePopupBox'

export default {
  plasmo: {getRootContainer},
  components: {ThePopupBox},
  setup() {},
  mounted() {},
}

export const config = {
  matches: ['<all_urls>'],
}

async function getRootContainer() {
  const [$html] = document.getElementsByTagName('html')

  if ($html) {
    const $rootContainer = document.createElement('div')
    $rootContainer.setAttribute('id', 'webpilot-container')
    $html.append($rootContainer)
    return $rootContainer
  }

  return null
}
</script>

<style module lang="scss">
.container {
  position: fixed !important;
  top: 10%;
  right: 0;
  z-index: 99999999999;
  width: 200px;
  height: 100px;
  overflow: hidden;
  line-height: 100px;
  text-align: center;
  background-color: #f00;
  border-radius: 10px;
  box-shadow: 0 2px 6px rgb(0 0 0 / 30%);
}
</style>

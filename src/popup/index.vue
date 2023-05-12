<template>
  <section :class="$style.notSupportPaeg">
    <HeaderPanel @on-close="closeWindow" />
    <section :class="$style.tipsWrap">
      <TipsNormal color="#CC0000" :tips="'Webpage not supported'">
        <template #icon> <IconError /> </template>
      </TipsNormal>
    </section>
    <section :class="$style.explain">
      Due to Chrome constrains, Webpilot can not be active on the following webpages:
      <ul role="list">
        <li>Chrome's Setting, History and Web Store page</li>
        <li>New tab page and blank page</li>
      </ul>
    </section>
    <TipsShortcut :class="$style.shortcut" />
  </section>
</template>

<script setup>
import {onBeforeMount} from 'vue'
import {sendToBackground} from '@plasmohq/messaging'

import HeaderPanel from '@/components/HeaderPanel.vue'
import TipsNormal from '@/components/TipsNormal.vue'
import IconError from '@/components/icon/IconError.vue'
import TipsShortcut from '@/components/TipsShortcut.vue'

onBeforeMount(async () => {
  const isKeepOpen = await sendToBackground({
    name: 'popupCheck',
  })

  if (!isKeepOpen) window.close()
})

const closeWindow = () => {
  window.close()
}
</script>
<style module lang="scss">
@import '@assets/styles/reset.scss';

.notSupportPaeg {
  position: relative;
  box-sizing: border-box;
  width: 480px;
  padding: 16px;
  padding-bottom: 24px;
}

.tipsWrap {
  margin-top: 8px;
}

.explain {
  margin-top: 8px;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;

  ul {
    margin: 0;
    padding-left: 20px;
    list-style-type: disc !important;
  }

  li {
    margin: 0;
  }
}

.shortcut {
  position: absolute;
  right: 16px;
  bottom: 16px;
}
</style>

<style>
/* * {
  box-sizing: border-box;
}

body {
  font-family: 'PingFang SC';
  padding: 0px;
  margin: 0px;
} */
</style>

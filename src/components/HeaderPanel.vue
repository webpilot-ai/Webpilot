<template>
  <section :class="$style.headerPanel">
    <section :class="$style.headerLogos">
      <img :class="$style.logo" :src="WebpilotLogo" />
      <section>Webpilot</section>
    </section>
    <section :class="$style.headerIcons">
      <HeaderSwitch />
      <IconGear :class="$style.icon" @click="openSettingPage" />
      <IconClose :class="$style.icon" />
    </section>
  </section>
</template>

<script setup>
import {sendToBackground} from '@plasmohq/messaging'

import WebpilotLogo from '../../assets/icon.png'

import IconClose from './icon/IconClose.vue'
import IconGear from './icon/IconGear.vue'

import HeaderSwitch from './HeaderSwitch.vue'

const openSettingPage = () => {
  sendToBackground({name: 'openSetting'})
}
</script>

<style lang="scss" module>
.headerPanel {
  display: flex;
  margin-bottom: 8px !important;
}

.headerLogos {
  display: flex;
  align-items: center;
  color: #292929;
  font-weight: 400;
  font-size: 14px;
  font-style: normal;
  line-height: 20px;
}

.headerIcons {
  display: flex;
  justify-content: center;
  margin-left: auto !important;
}

.logo {
  width: 16px;
  height: 16px;
  margin-right: 8px;
}

.icon {
  width: 24px;
  height: 24px;
  cursor: pointer;
}

.icon + .icon {
  margin-left: 15px;
}
</style>

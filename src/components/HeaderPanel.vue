<template>
  <section :class="$style.headerPanel">
    <section :class="$style.headerLogos">
      <img :class="$style.logo" :src="WebpilotLogo" />
      <section>Webpilot</section>
    </section>
    <section :class="$style.headerIcons">
      <Popper :class="$style.popover" hover offset-distance="8" placement="top">
        <IconGear :class="$style.icon" @click="openSettingPage" />
        <template #content>
          <span :class="$style.popoverText">Settings</span>
        </template>
      </Popper>
      <Popper :class="$style.popover" hover offset-distance="8" placement="top">
        <IconClose :class="$style.icon" @click="closePopup" />
        <template #content>
          <span :class="$style.popoverText">Close</span>
        </template>
      </Popper>
    </section>
  </section>
</template>

<script setup>
import {sendToBackground} from '@plasmohq/messaging'
import Popper from 'vue3-popper'

import WebpilotLogo from '../../assets/icon.png'

import IconClose from './icon/IconClose.vue'
import IconGear from './icon/IconGear.vue'

const emits = defineEmits(['onClose'])

const openSettingPage = () => {
  sendToBackground({name: 'openSetting'})
}

const closePopup = () => {
  emits('onClose')
}
</script>

<style lang="scss" module>
.headerPanel {
  display: flex;
  height: 24px;
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

  &:hover {
    filter: brightness(2);
  }
}

.icon + .icon {
  margin-left: 15px;
}

.popoverText {
  padding: 4px 8px;
  color: #fff;
  font-weight: 500;
  font-size: 12px;
  line-height: 17px;
  background-color: black;
  border-radius: 5px;
}

.popover {
  max-height: 24px;
  line-height: 24px;
}

.popover + .popover {
  padding-left: 17px;
}
</style>

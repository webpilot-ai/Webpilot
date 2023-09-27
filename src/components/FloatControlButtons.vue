<template>
  <ul>
    <li :class="$style.box">
      <Popper hover offset-distance="14" offset-skid="-4" placement="right">
        <div :class="$style.btn"><IconClose :class="$style.ico" @click="closePopup" /></div>
        <template #content>
          <span :class="$style.popover">Close</span>
        </template>
      </Popper>
    </li>
    <li v-show="showSetting" :class="$style.box">
      <Popper hover offset-distance="14" offset-skid="-4" placement="right">
        <div :class="$style.btn"><IconGear :class="$style.ico" @click="openSettingPage" /></div>
        <template #content>
          <span :class="$style.popover">Settings</span>
        </template>
      </Popper>
    </li>
  </ul>
</template>

<script setup>
import {sendToBackground} from '@plasmohq/messaging'
import Popper from 'vue3-popper'

import IconClose from './icon/IconClose.vue'
import IconGear from './icon/IconGear.vue'

defineProps({
  showSetting: {
    type: Boolean,
    default: false,
  },
})

const emits = defineEmits(['onClose'])

const openSettingPage = () => {
  sendToBackground({name: 'openSetting'})
}

const closePopup = () => {
  emits('onClose')
}
</script>

<style lang="scss" module>
.box {
  margin-bottom: 16px;
  list-style: none;
}

.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background-color: var(--webpilot-theme-main-background-color, #fff);
  border-radius: 8px;
  box-shadow: 0 2px 6px var(--webpilot-theme-main-background-shadow, rgb(0 0 0 / 20%));
}

.ico {
  width: 24px;
  height: 24px;
  filter: brightness(var(--webpilot-theme-brightness-number));
}

.popover {
  padding: 4px 8px;
  color: #fff;
  font-weight: 500;
  font-size: 12px;
  line-height: 17px;
  background-color: black;
  border-radius: 5px;
}
</style>

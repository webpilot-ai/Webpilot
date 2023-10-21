<template>
  <ul :class="$style.control">
    <li v-show="!showBack" :class="$style.box">
      <Popper hover offset-distance="14" offset-skid="-4" placement="right">
        <InteractiveIcon :class="$style.btn" type="close" @click="popupClose" />
        <!-- <div :class="$style.btn">
          <InteractiveIcon :class="$style.ico" type="close" @click="popupClose" />
        </div> -->
        <template #content>
          <span :class="$style.popover">{{ $gettext('Close') }}</span>
        </template>
      </Popper>
    </li>
    <li v-show="showBack" :class="$style.box">
      <Popper hover offset-distance="14" offset-skid="-4" placement="right">
        <InteractiveIcon :class="$style.btn" type="previous" @click="popupBack" />
        <!-- <div :class="$style.btn">
          <InteractiveIcon :class="$style.ico" type="previous" @click="popupBack" />
        </div> -->
        <template #content>
          <span :class="$style.popover">{{ $gettext('Back') }}</span>
        </template>
      </Popper>
    </li>
    <li v-show="showSetting" :class="$style.box">
      <Popper hover offset-distance="14" offset-skid="-4" placement="right">
        <InteractiveIcon :class="$style.btn" type="setting" @click="openSettingPage" />
        <!-- <div :class="$style.btn">
          <InteractiveIcon :class="$style.ico" type="setting" @click="openSettingPage" />
        </div> -->
        <template #content>
          <span :class="$style.popover">{{ $gettext('Settings') }}</span>
        </template>
      </Popper>
    </li>
  </ul>
</template>

<script setup>
import {sendToBackground} from '@plasmohq/messaging'
import Popper from 'vue3-popper'

import {$gettext} from '@/utils/i18n'

import InteractiveIcon from './InteractiveIcon/InteractiveIcon.vue'

defineProps({
  showSetting: {
    type: Boolean,
    default: false,
  },
  showBack: {
    type: Boolean,
    default: false,
  },
})

const emits = defineEmits(['onClose', 'onBack'])

const openSettingPage = () => {
  sendToBackground({name: 'openSetting'})
}

const popupClose = () => {
  emits('onClose')
}
const popupBack = () => {
  emits('onBack')
}
</script>

<style lang="scss" module>
.control {
  position: absolute;
  top: 8px;
  right: -44px;
  margin: 0 !important;
  padding: 0;
}

.box {
  margin-bottom: 16px;
  list-style: none;

  .btn {
    box-sizing: content-box !important;

    // display: flex;
    // width: 36px;
    // height: 36px;
    width: 24px;
    height: 24px;
    padding: 6px;
    background-color: var(--webpilot-theme-main-background-color, #fff);
    background-origin: content-box;
    border-radius: 8px;
    box-shadow: 0 2px 6px var(--webpilot-theme-main-background-shadow, rgb(0 0 0 / 20%));
  }
}

// .ico {
//   flex: 1;
//   filter: brightness(var(--webpilot-theme-brightness-number));
// }

.popover {
  padding: 4px 8px;
  color: #fff;
  font-weight: 500;
  font-size: 12px;
  line-height: 17px;
  white-space: nowrap;
  background-color: black;
  border-radius: 5px;
  user-select: none;
}
</style>

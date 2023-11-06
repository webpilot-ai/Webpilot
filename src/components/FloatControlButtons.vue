<template>
  <ul :class="$style.control">
    <li v-show="!showBack" :class="$style.box">
      <Popper hover offset-distance="2" offset-skid="-4" placement="right">
        <InteractiveIcon :class="$style.btn" type="close" @click="popupClose" />
        <template #content>
          <span :class="$style.popover">{{ $gettext('Close') }}</span>
        </template>
      </Popper>
    </li>
    <li v-show="showBack" :class="$style.box">
      <Popper hover offset-distance="2" offset-skid="-4" placement="right">
        <InteractiveIcon :class="$style.btn" type="previous" @click="popupBack" />
        <template #content>
          <span :class="$style.popover">{{ $gettext('Back') }}</span>
        </template>
      </Popper>
    </li>
    <li v-show="showSetting" :class="$style.box">
      <Popper hover offset-distance="2" offset-skid="-4" placement="right">
        <InteractiveIcon :class="$style.btn" type="setting" @click="openSettingPage" />
        <template #content>
          <span :class="$style.popover">{{ $gettext('Settings') }}</span>
        </template>
      </Popper>
    </li>
    <li v-show="showCopy" :class="$style.box">
      <Popper hover offset-distance="2" offset-skid="-4" placement="right">
        <InteractiveIcon :class="$style.btn" type="copy" @click="handleCopy" />
        <template #content>
          <span :class="$style.popover">{{ $gettext('Copy') }}</span>
        </template>
      </Popper>
    </li>
  </ul>
</template>

<script setup>
import {sendToBackground} from '@plasmohq/messaging'
import Popper from 'vue3-popper'
import copyToClipboard from 'copy-to-clipboard'

import {$gettext} from '@/utils/i18n'

import InteractiveIcon from './InteractiveIcon/InteractiveIcon.vue'

const props = defineProps({
  showSetting: {
    type: Boolean,
    default: false,
  },
  showBack: {
    type: Boolean,
    default: false,
  },
  showCopy: {
    type: Boolean,
    default: false,
  },
  result: {
    type: String,
    default: '',
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
const handleCopy = () => {
  copyToClipboard(props.result, {format: 'text/plain'})
}
</script>

<style lang="scss" module>
.control {
  position: absolute;
  top: 8px;
  right: -44px;
  margin: 0;
  padding: 0;
}

.box {
  margin-bottom: 16px;
  list-style: none;

  .btn {
    // box-sizing: content-box;
    width: 36;
    height: 36;
    padding: 6px;
    background-color: var(--webpilot-theme-main-background-color, #fff);
    background-origin: content-box;
    border-radius: 8px;
    box-shadow: 0 2px 6px var(--webpilot-theme-main-background-shadow, rgb(0 0 0 / 20%));
  }
}

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

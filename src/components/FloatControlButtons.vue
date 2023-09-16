<template>
  <ul>
    <li :class="$style.box">
      <Popper hover offset-distance="14" offset-skid="-4" placement="right">
        <IconClose :class="$style.ico" @click="closePopup" />
        <template #content>
          <span :class="$style.popoverText">Close</span>
        </template>
      </Popper>
    </li>
    <li v-show="showSetting" :class="$style.box">
      <Popper hover offset-distance="14" offset-skid="-4" placement="right">
        <IconGear :class="$style.ico" @click="openSettingPage" />
        <template #content>
          <span :class="$style.popoverText">Settings</span>
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
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  margin-bottom: 16px;
  background-color: #fff;
  border-radius: 8px;
}

.ico {
  width: 24px;
  height: 24px;
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
</style>

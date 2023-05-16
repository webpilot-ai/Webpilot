<script setup>
import {computed, ref} from 'vue'
import {storeToRefs} from 'pinia'

import WebpilotCheckbox from '@/components/WebpilotCheckbox.vue'
import WebpilotAlert from '@/components/WebpilotAlert.vue'
import IllustrationSelectText from '@/components/icon/IllustrationSelectText.vue'
import DisplayMode from '@/components/DisplayMode.vue'
import useConfigStore from '@/stores/config'

import ShortcutInput from '@/components/ShortcutInput.vue'

import {formatShortcut} from '@/utils/index'

const storeConfig = useConfigStore()

const {config} = storeToRefs(storeConfig)

const {customShortcut} = config.value

const autoPopup = ref(config.value.autoPopup)
const mode = ref(config.value.displayMode)

const onShotcutChange = customShortcut => {
  storeConfig.setConfig({
    ...storeConfig.config,
    customShortcut,
  })
}

const onAutoPopupChange = value => {
  storeConfig.setConfig({
    ...storeConfig.config,
    autoPopup: value,
  })
}

const osDisplayModeChange = value => {
  storeConfig.setConfig({
    ...storeConfig.config,
    displayMode: value,
  })
}

const shotcut = computed(() => {
  return formatShortcut(storeConfig.config.customShortcut)
})
</script>

<template>
  <div>
    <h2 :class="stepTwo.shortcutGuideTitle">
      Select text, and press <span>{{ shotcut }}</span> to ask Webpilot
    </h2>
    <div :class="stepTwo.changeShorcut">
      <span>Change Shortcut</span>
      <ShortcutInput v-model="customShortcut" :show-reset="false" @change="onShotcutChange" />
    </div>
    <WebpilotCheckbox
      v-model="autoPopup"
      label="Display Webpilot icon when text is selected"
      style="margin-top: 16px"
      @change="onAutoPopupChange"
    />
    <IllustrationSelectText style="margin-top: 12px" />
    <WebpilotAlert
      style="margin-top: 6px"
      tips="Webpilot will answer based on the current page if no text is selected"
      type="info"
    />
    <div v-if="true" :class="stepTwo.displayMode">
      <h2 :class="stepTwo.title">Display mode</h2>
      <DisplayMode
        v-model="mode"
        style="margin-top: 2px; margin-bottom: 55px"
        @change="osDisplayModeChange"
      />
    </div>
  </div>
</template>

<style module="stepTwo" lang="scss">
.shortcutGuideTitle {
  font-weight: 400;
  font-size: 18px;
  line-height: 25px;

  span {
    padding: 2px 4px;
    color: #4f5aff;
    border: 1px solid #4f5aff;
    border-radius: 5px;
  }
}

.changeShorcut {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 8px;

  span {
    margin-right: 12px;
    color: #585b58;
    font-size: 14px;
    line-height: 20px;
  }

  input {
    width: 140px;
    height: 36px;
    padding: 8px;
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    border: 1px solid #dcdee1;
    border-radius: 5px;
  }

  input:focus {
    outline: none;
  }
}

.displayMode {
  display: flex;
  flex-direction: column;
  margin-top: 48px;

  .title {
    color: #292929;
    font-weight: 400;
    font-size: 18px;
    line-height: 25px;
  }
}
</style>

<template>
  <div :class="$style['extension-view']">
    <h2 :class="$style.title">
      <span>Active</span>
      <WebpilotLogo :class="$style['title-logo']" />
    </h2>
    <div>
      <div :class="$style['show-webpilot-option']">
        <span>Show Webpilot on text selection</span>

        <SwitchButton
          v-model="store.config.autoPopup"
          :class="$style['show-webpilot-option-swith']"
          @on-change="onAutoPopupChange"
        />
      </div>
      <ImageSelectText />
      <div :class="$style['shortcut-setting']">
        <span :class="$style['shortcut-setting-label']">Shortcut</span>
        <ShortcutInput v-model="shortcutKeys" @change="onChangeShortcut" />
      </div>
    </div>
  </div>
</template>

<script lang="ts"></script>

<script lang="ts" setup>
import {ref} from 'vue'
import {storeToRefs} from 'pinia'

import useStore from '@/stores/store'

import ShortcutInput from '@/components/ShortcutInput.vue'
import ImageSelectText from '@/components/image/ImageSelectText.vue'

import WebpilotLogo from '../images/icon-logo.vue'
import SwitchButton from '../components/SwitchButton.vue'

const store = useStore()
const {config} = storeToRefs(store)

// Active Select popup
const onAutoPopupChange = value => {
  store.config.autoPopup = value
  store.setConfig(store.config)
}

// Shortcut
const shortcutKeys = ref(config.value.customShortcut)

const onChangeShortcut = customShortcut => {
  store.setConfig({
    ...store.config,
    customShortcut,
  })
}
</script>

<style module>
.extension-view {
  color: var(--color-baseline-text);
  font-weight: 400;
  font-size: 14px;
  font-style: normal;
  line-height: normal;
}

.title {
  margin: 0;
  margin-bottom: 25px;
  color: var(--color-baseline-text);
  font-weight: 600;
  font-size: 24px;
  font-style: normal;
  line-height: normal;
}

.title-logo {
  margin-left: 9px;
}

.show-webpilot-option {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.show-webpilot-option-swith {
  margin-left: 16px;
}

.shortcut-setting {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 24px;
}

.shortcut-setting-label {
  margin-right: 12px;
}
</style>

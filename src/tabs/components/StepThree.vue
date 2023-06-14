<template>
  <div :class="stepThree.wrap">
    <h3>{{ $gettext('Using WebPilot') }}</h3>

    <h2 :class="stepThree.shortcutGuideTitle">
      <span>{{ $gettext('Press ') }}</span>
      <span :class="stepThree.shotcut">{{ shotcut }}</span>
      <span>{{ $gettext(' to use WebPilot on any website.') }}</span>
    </h2>
    <div :class="stepThree.changeShorcut">
      <span>Change Shortcut</span>
      <ShortcutInput v-model="customShortcut" :show-reset="false" @change="onShotcutChange" />
    </div>
    <WebpilotCheckbox
      v-model="autoPopup"
      :label="$gettext('Show WebPilot icon when selecting text')"
      style="margin-top: 16px"
      @change="onAutoPopupChange"
    />
    <IllustrationSelectText style="margin-top: 12px" />
    <WebpilotAlert
      style="margin-top: 6px"
      :tips="$gettext('Select text first, hit shortcut next, gain better results.')"
      type="info"
    />
    <div v-if="false" :class="stepThree.displayMode">
      <h2 :class="stepThree.title">Display mode</h2>
      <DisplayMode
        v-model="mode"
        style="margin-top: 2px; margin-bottom: 55px"
        @change="osDisplayModeChange"
      />
    </div>
  </div>
</template>

<script setup>
import {computed, ref} from 'vue'
import {storeToRefs} from 'pinia'

import {$gettext} from '@/utils/i18n'

import WebpilotCheckbox from '@/components/WebpilotCheckbox.vue'
import WebpilotAlert from '@/components/WebpilotAlert.vue'
import IllustrationSelectText from '@/components/icon/IllustrationSelectText.vue'
import DisplayMode from '@/components/DisplayMode.vue'
import useStore from '@/stores/store'

import ShortcutInput from '@/components/ShortcutInput.vue'

import {formatShortcut} from '@/utils/index'

const store = useStore()

const {config} = storeToRefs(store)

const {customShortcut} = config.value

const autoPopup = ref(config.value.autoPopup)
const mode = ref(config.value.displayMode)

const onShotcutChange = customShortcut => {
  store.setConfig({
    ...store.config,
    customShortcut,
  })
}

const onAutoPopupChange = value => {
  store.setConfig({
    ...store.config,
    autoPopup: value,
  })
}

const osDisplayModeChange = value => {
  store.setConfig({
    ...store.config,
    displayMode: value,
  })
}

const shotcut = computed(() => {
  return formatShortcut(store.config.customShortcut)
})
</script>

<style module="stepThree" lang="scss">
.wrap {
  h3 {
    margin: 0 0 16px;
    font-weight: 400;
    font-size: 24px;
    line-height: 34px;
    text-align: center;
  }
}

.shortcutGuideTitle {
  font-weight: 400;
  font-size: 18px;
  line-height: 25px;

  .shotcut {
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

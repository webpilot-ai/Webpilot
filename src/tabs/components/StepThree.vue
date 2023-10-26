<template>
  <div>
    <WelcomeTitle @on-prev="goBack">{{ $gettext('How to Use') }}</WelcomeTitle>

    <h2 :class="stepThree['shortcut-guide']">
      <span>{{ $gettext('Select text, and press ') }}</span>
      <template v-for="(item, index) in shortcuts" :key="index">
        <b v-if="index !== 0" :class="stepThree['key-add']">+</b>
        <b
          :class="[
            stepThree['key-cap'],
            stepThree[`key-cap${item.length > 1 ? '--big' : '--small'}`],
          ]"
          >{{ item }}</b
        >
      </template>
      <span>{{ $gettext(' to use') }}</span>
    </h2>
    <div :class="stepThree['shortcut-input']">
      <span>{{ $gettext('Change Shortcut') }}</span>
      <ShortcutInput v-model="customShortcut" :show-reset="false" @change="onShortcutChange" />
    </div>
    <WebpilotCheckbox
      v-model="autoPopup"
      :label="$gettext('Display Webpilot icon when text is selected')"
      style="margin-top: 16px"
      @change="onAutoPopupChange"
    />
    <ImageSelectTextWithIcon v-if="autoPopup" style="margin-top: 12px" />
    <ImageSelectTextWithoutIcon v-else style="margin-top: 12px" />
    <WebpilotAlert
      style="margin-top: 6px"
      :tips="$gettext('Webpilot will answer based on the current page if no text is selected')"
      type="info"
    />
    <footer :class="stepThree['nav-btn']">
      <WebpilotButton :value="'NEXT'" @click="onNext" />
    </footer>
  </div>
</template>

<script setup>
import {computed, ref} from 'vue'
import {storeToRefs} from 'pinia'

import {$gettext} from '@/utils/i18n'

import WebpilotCheckbox from '@/components/WebpilotCheckbox.vue'
import WebpilotAlert from '@/components/WebpilotAlert.vue'
import WebpilotButton from '@/components/WebpilotButton.vue'
import ImageSelectTextWithIcon from '@/components/image/ImageSelectTextWithIcon.vue'
import ImageSelectTextWithoutIcon from '@/components/image/ImageSelectTextWithoutIcon.vue'
import useStore from '@/stores/store'

import ShortcutInput from '@/components/ShortcutInput.vue'

import {formatShortcut} from '@/utils/index'

import WelcomeTitle from './WelcomeTitle.vue'

const store = useStore()

const emits = defineEmits(['onPrev', 'onNext'])

const goBack = () => emits('onPrev')
const onNext = () => emits('onNext')

const {config} = storeToRefs(store)

const {customShortcut} = config.value

const autoPopup = ref(config.value.autoPopup)

const onShortcutChange = customShortcut => {
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

const shortcuts = computed(() => formatShortcut(store.config.customShortcut).split(' + '))
</script>

<style module="stepThree" lang="scss">
.shortcut-guide {
  margin-top: 32px;
  font-weight: 400;
  font-size: 18px;
  line-height: 24px;
}

.key-cap,
.key-add {
  display: inline-block;
  color: #4f5aff;
  font-weight: 700;
  font-size: 12px;
  line-height: 24px;
}

.key-cap {
  margin: 0 5px;
  padding: 0 8px;
  background: 0 / 100% 100% no-repeat;

  &--big {
    background-image: url('../images/key-cap-big.png');
  }

  &--small {
    background-image: url('../images/key-cap-small.png');
  }
}

.key-add {
  width: 12px;
  text-align: center;
}

.shortcut-input {
  display: flex;
  flex-direction: row;
  align-items: center;

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

.nav-btn {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-top: 66px;
}
</style>

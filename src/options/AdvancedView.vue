<template>
  <div :class="advanced.main">
    <div :class="[advanced.api, advanced.panel]">
      <span :class="advanced.title">{{ gettext('aPISettings') }}</span>
      <div :class="advanced.apiItem">
        <label :class="advanced.subtitle" for="provider">{{ gettext('activeAPIProvider') }}</label>
        <select id="provider" name="provider">
          <option :class="advanced.iconLogo" selected value="open_ai_3.5">
            OpenAI gpt-3.5-terbo
          </option>
          <option value="open_ai_4.0">OpenAI gpt-4.0-terbo</option>
          <!-- <option value="baidu_wenxin">百度文心</option> -->
        </select>
        <img alt="" :class="advanced.dropdown" src="./images/dropdown.png" @click="openSelect" />
      </div>
      <div :class="advanced.apiItem">
        <label :class="advanced.subtitle" for="keys">Your API Key</label>
        <input
          id="keys"
          v-model="authKey"
          :class="{[advanced.haveAuthKey]: storeConfig.authKey !== ''}"
          name="keys"
          :placeholder="authKeyPlaceHolder"
          role="authkey"
          type="text"
          @blur="onBlurSetAuthkey"
          @change="onApiKeyChange"
          @focus="onEditAuthKey"
        />
        <WebpilotAlert v-if="alertInfo.type !== ''" :tips="alertInfo.tips" :type="alertInfo.type" />

        <span :class="advanced.links">
          {{ gettext('visit') }}: <a :href="links" target="_blank">{{ links }}</a>
        </span>
        <div :class="advanced.host">
          <div :class="advanced.selfHost">
            <input id="self_host" v-model="isSelfHost" name="self_host" type="checkbox" />
            <label for="self_host">{{ gettext('seftHost') }}</label>
          </div>
          <div :class="advanced.more">
            <span :class="advanced.question_mark"></span>{{ gettext('moreHelp') }}
          </div>
        </div>
        <div v-if="isSelfHost" :class="advanced.selfHostInput">
          <input
            v-model="selfHostUrl"
            placeholder="Enter your base address"
            @change="onChangeHostUrl"
          />
        </div>
      </div>

      <WebpilotButton
        :disalbed="!validatedKey"
        style="width: 143px; margin-top: auto"
        :value="saveChange"
        @click="save()"
      />
    </div>

    <div :class="[advanced.extension, advanced.panel]">
      <span :class="advanced.title">{{ gettext('extensionSettings') }}</span>
      <span :class="advanced.subtitle">{{ gettext('displayMode') }}</span>
      <div :class="advanced.mode">
        <!-- Sider bar under development -->
        <div v-if="false" :class="advanced.radioGroup">
          <input
            id="sideBar"
            :checked="storeConfig.config.displayMode == 'siderBar'"
            name="mode"
            type="radio"
            @input="changeMode('siderBar')"
          />
          <label for="sideBar">
            {{ gettext('sideBar') }}
            <img alt="sideBar" :class="advanced.modeImg" src="./images/Side_bar.svg" />
          </label>
        </div>
        <div :class="advanced.radioGroup">
          <input
            id="popUp"
            :checked="storeConfig.config.displayMode == 'popUp'"
            name="mode"
            type="radio"
            @input="changeMode('popUp')"
          />
          <label for="popUp">
            {{ gettext('popUp') }}
            <img alt="popUp" :class="advanced.modeImg" src="./images/Pop_up.svg" />
          </label>
        </div>
      </div>

      <span :class="advanced.subtitle">{{ gettext('activeWebpilot') }}</span>
      <div :class="advanced.activeWebpilot">
        <SwitchButton v-model="storeConfig.config.autoPopup" @on-change="onAutoPopupChange" />
        <div :class="advanced.activeWebpilotDesc">
          Display Webpilot <img :src="WebpilotLogo" /> when text is selected
        </div>
      </div>

      <span :class="advanced.subtitle">{{ gettext('changeShortcut') }}</span>
      <div :class="advanced.shortcut">
        <input
          maskText="hello"
          name="shortcut"
          placeholder="Ctrl+M"
          type="text"
          @blur="onBlurShortcutInput"
          @focus="onFocusShortcutInput"
          @input="saveShortcut($event.target.value)"
        />
        <div v-if="isFocusShortcut" :class="advanced.shortcutMask">{{ gettext('presskey') }}</div>
        <span @click="shortCut = storeConfig.config.customShortcut">{{ gettext('reset') }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import {computed, ref, watch} from 'vue'
import {useMagicKeys} from '@vueuse/core'
import {storeToRefs} from 'pinia'

import {$gettext as gettext} from '@/utils/i18n'
import useConfigStore from '@/stores/config'
import useStore, {REQUEST_STATE} from '@/stores/store'

import WebpilotAlert from '@/components/WebpilotAlert.vue'
import WebpilotButton from '@/components/WebpilotButton.vue'

import WebpilotLogo from '../../assets/icon.png'

import SwitchButton from './components/SwitchButton.vue'

const links = ref('https://platform.openai.com/account/api-keys')

const storeConfig = useConfigStore()
const store = useStore()

const {config} = storeToRefs(storeConfig)
const saveAuthKey = ref('')
/** Edit Auth Key */
const authKey = ref('')
const validatedKey = ref(false)

const authKeyPlaceHolder = computed(() => {
  const key = saveAuthKey.value === '' ? storeConfig.config.authKey : saveAuthKey.value

  if (key === '' || !key) return 'Enter your API Key from OpenAI'

  const startText = key.substring(0, 3)
  const endText = key.substring(key.length - 4, key.length)
  return `${startText}...${endText}`
})

const onEditAuthKey = () => {
  // use saved temp key first
  if (saveAuthKey.value !== '') {
    authKey.value = saveAuthKey.value
    return
  }

  // if cna't find local save auhtkey use storeconfig authkey
  const {authKey: key} = config.value
  if (key === '' || !key) return
  saveAuthKey.value = key
  authKey.value = key
}

const onBlurSetAuthkey = () => {
  if (authKey.value !== '') authKey.value = ''
}

const onApiKeyChange = async () => {
  saveAuthKey.value = authKey.value
  await store.askAi({authKey: authKey.value, command: 'Say hi.'})
  validatedKey.value = true
}

const alertInfo = computed(() => {
  if (store.requestState === REQUEST_STATE.ERROR) {
    return {
      type: 'error',
      tips: 'Incorrect API Key. Please check with the provider',
    }
  }
  if (store.requestState === REQUEST_STATE.SUCCESS) {
    return {
      type: 'success',
      tips: 'Successfully added',
    }
  }

  return {
    type: '',
    tips: '',
  }
})

// Self Host
const isSelfHost = ref(!!config.value.selfHostUrl)
const selfHostUrl = ref(config.value.selfHostUrl)

const onChangeHostUrl = async () => {
  await store.askAi({authKey: saveAuthKey.value, command: 'Say hi.', url: selfHostUrl.value})
  validatedKey.value = true
}
const saveChange = gettext('saveChanges')

const save = () => {
  storeConfig.setConfig({
    ...storeConfig.config,
    authKey: saveAuthKey.value,
    selfHostUrl: selfHostUrl.value,
  })
}

// Display Mode
const changeMode = str => {
  storeConfig.config.displayMode = str
  storeConfig.setConfig(storeConfig.config)
}

// Active Select popup
const onAutoPopupChange = value => {
  storeConfig.config.autoPopup = value
  storeConfig.setConfig(storeConfig.config)
}

// Shortcut
const isFocusShortcut = ref(false)
const onFocusShortcutInput = () => (isFocusShortcut.value = true)
const onBlurShortcutInput = () => (isFocusShortcut.value = false)
const {current: currentKeys} = useMagicKeys()
watch(currentKeys, v => {
  if (!v) return

  const keys = Array.from(v)

  console.log('Keys:', keys)
})

const saveShortcut = value => {
  storeConfig.config.customShortcut = value
  storeConfig.setConfig(storeConfig.config)
}

const openSelect = () => {
  console.log('select open')
}
</script>

<style module="advanced" lang="scss">
.openAiLogo {
  width: 22px;
  height: 22px;
}

.main {
  margin-top: 20px;
  padding: 24px 16px;
  font-family: 'PingFang SC', Helvetica, Arial, sans-serif;
}

.panel {
  display: flex;
  flex-direction: column;
  padding: 24px 16px;
  background-color: white;
  border-radius: 10px;

  &:last-child {
    margin-top: 27px;
  }

  .title {
    color: #4f5aff;
    font-weight: 400;
    font-size: 24px;
    line-height: 34px;
  }

  .subtitle {
    margin-top: 24px;
    color: #292929;
    font-weight: 400;
    font-size: 18px;
    line-height: 25px;
  }

  select,
  input[type='text'][role='authkey'] {
    width: 360px;
    height: 36px;
    margin-top: 8px;
    padding-left: 8px;
    font-size: 14px;
    line-height: 20px;
    border: 1px solid #dcdee1;
    border-radius: 5px;
  }

  select {
    padding-left: 38px;
    background: url('./images/edit.svg') no-repeat;
    background-position: 10px center;
    background-size: 22px 22px;
    appearance: none;
  }

  .dropdown {
    position: relative;
    top: -20px;
    left: 340px;
    width: 10px;
    height: 6px;
  }

  option {
    font-size: 14px;
    line-height: 20px;
  }

  .links {
    margin-top: 8px;
    font-size: 14px;
    line-height: 20px;
  }
}

.api {
  display: flex;
  flex-direction: column;
  height: 426px;
}

.apiItem {
  display: flex;
  flex-direction: column;
}

.haveAuthKey::placeholder {
  color: #292929;
}

.host {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 360px;
  margin-top: 8px;
}

.selfHost {
  display: flex;
  flex-direction: row;
  align-items: center;
  cursor: pointer;

  * {
    cursor: pointer;
  }

  input {
    width: 16px;
    height: 16px;
    margin: 0;
    margin-right: 8px;
  }

  label {
    margin-top: 0;
    font-size: 14px;
    line-height: 20px;
    user-select: none;
  }
}

.selfHostInput {
  margin-top: 8px;

  input {
    width: 360px;
    height: 36px;
    padding: 8px;
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    border: 1px solid #dcdee1;
    border-radius: 5px;
  }
}

.more {
  /* identical to box height */
  display: inline;
  color: #585b58;
  font-size: 14px;
  line-height: 20px;
  text-align: right;
  text-decoration-line: underline;

  .question_mark {
    display: inline;
    width: 16px;
    height: 16px;
    margin-right: 6px;
    vertical-align: middle;
  }
}

.saveButton {
  width: 143px;
  margin-top: auto;
  padding: 8px 16px;
  color: white;
  font-weight: 500;
  font-size: 14px;
  font-family: 'PingFang SC', Helvetica, Arial, sans-serif;
  line-height: 20px;
  background-color: #929497;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.mode {
  display: flex;
  margin-top: 10px;
}

.radioGroup {
  display: flex;

  * {
    cursor: pointer;
  }

  &:first-child {
    margin-right: 33px;
  }

  input {
    margin-top: 0;
    margin-right: 11px;
  }

  label {
    display: flex;
    color: #585b58;
    font-weight: 400;
    font-size: 14px;
    line-height: 64px;
  }

  .modeImg {
    margin-left: 9px;
  }
}

.extension {
  color: yellow;
}

.activeWebpilot {
  display: flex;
  margin-top: 9px;

  div {
    display: inline;
    padding-left: 6px;
    color: #585b58;
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
  }

  img {
    display: inline-block;
    width: 16px;
    height: 16px;
    margin: 0 4px;
  }
}

.activeWebpilotDesc {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.shortcut {
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  margin-top: 8px;
  margin-bottom: 30px;

  input {
    width: 140px;
    height: 36px;
    margin-right: 8px;
    padding: 8px;
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    border: 1px solid #929497;
    border-radius: 5px;
  }

  span {
    color: #585b58;
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    text-decoration: underline;
    cursor: pointer;
  }
}

.shortcutMask {
  position: absolute;
  top: 8px;
  left: 8px;
  width: 124px;
  height: 20px;
  color: #585b58;
  font-weight: 400;
  font-size: 14px;
  font-style: normal;
  line-height: 20px;
  background-color: #fff;
}
</style>

<template>
  <div :class="advanced.main">
    <div :class="[advanced.api, advanced.panel]">
      <span :class="advanced.title">{{ $gettext('API Settings') }}</span>
      <div :class="[advanced.general, selectedOption === 'general' ? advanced.active : '']">
        <!-- <div v-if="false" :class="advanced.general"> -->
        <div :class="advanced.radio">
          <input
            id="option1"
            v-model="selectedOption"
            name="option"
            type="radio"
            value="general"
            @change="handleOptionChange"
          />
          <label for="option1">Use Free OpenAI GPT API from Webpilot</label>
        </div>
        <div :class="advanced.usage">
          <div :class="[advanced.progressBar, selectedOption === 'general' ? advanced.active : '']">
            <span
              :class="usage.percent === '100%' ? advanced.none : ''"
              :style="{width: usage.percent}"
            ></span>
          </div>
          <p>{{ usage.current }} / {{ usage.total }} available</p>
          <Popper arrow :class="advanced.popper" hover>
            <span :class="advanced.help">?</span>
            <template #content>
              <div :class="advanced.popoverText">
                API limits to 50 times per week. It refreshes every Monday at 0:00 UTC+0
              </div>
            </template>
          </Popper>
        </div>
        <div v-if="usage.percent === '100%'" :class="advanced.limited">
          <WebpilotAlert :tips="'Used up all free API calls'" :type="'error'" />
          <a @click="onChangePlan">Switch to use own API</a>
        </div>
      </div>
      <div :class="[advanced.personal, selectedOption === 'personal' ? advanced.active : '']">
        <div :class="advanced.radio">
          <input
            id="option2"
            v-model="selectedOption"
            name="option"
            type="radio"
            value="personal"
            @change="handleOptionChange"
          />
          <label for="option2">Set up your OpenAI API</label>
        </div>
        <div v-if="selectedOption === 'personal'">
          <div :class="advanced.apiItem">
            <input
              id="keys"
              v-model="authKey"
              :class="{[advanced.haveAuthKey]: store.config.authKey !== ''}"
              name="keys"
              :placeholder="authKeyPlaceHolder"
              role="authkey"
              type="text"
              @blur="onBlurSetAuthkey"
              @focus="onEditAuthKey"
            />
            <WebpilotAlert
              v-if="(error || success) && !isSelfHost"
              :auto-hide="true"
              style="margin-top: 8px"
              :tips="alertInfo.tips"
              :type="alertInfo.type"
              @on-hide="hideAlert"
            />
            <div :class="advanced.apiKeyGuide">
              <p>
                To get your API key, log into
                <a href="https://platform.openai.com/account/api-keys" target="_blank">
                  Open AI > API Keys</a
                >
              </p>
              <p>Click <b>“Create new secret key”</b>. Copy and paste key above</p>
            </div>

            <div :class="advanced.host">
              <div :class="advanced.selfHost">
                <input
                  id="self_host"
                  v-model="isSelfHost"
                  name="self_host"
                  type="checkbox"
                  @change="chekcCloseSelfHost"
                />
                <label for="self_host">Self Host</label>
              </div>
            </div>
            <div v-if="isSelfHost" :class="advanced.selfHostInput">
              <input
                v-model="selfHostUrl"
                placeholder="https://api.openai.com"
                @change="onChangeHostUrl"
              />
              <WebpilotAlert
                v-if="(error || success) && isSelfHost"
                style="margin-top: 8px"
                :tips="alertInfo.tips"
                :type="alertInfo.type"
              />
            </div>
          </div>
        </div>
      </div>
      <WebpilotButton
        :auto-hide="true"
        :disalbed="selectedOption === 'personal' && saveAuthKey === ''"
        :loading="loading"
        style="width: 143px; margin-top: auto"
        :value="$gettext('Save Changes')"
        @click="save()"
        @on-hide="hideAlert"
      />
    </div>

    <div :class="[advanced.extension, advanced.panel]">
      <span :class="advanced.title">{{ $gettext('Extension Settings') }}</span>
      <span v-if="false" :class="[advanced.subtitle, advanced.displayMode]">{{
        $gettext('Display Mode')
      }}</span>
      <div v-if="false" :class="advanced.mode">
        <!-- Sider bar under development -->
        <div v-if="false" :class="advanced.radioGroup">
          <input
            id="sideBar"
            :checked="store.config.displayMode == 'siderBar'"
            name="mode"
            type="radio"
            @input="changeMode('siderBar')"
          />
          <label for="sideBar">
            {{ $gettext('Side Bar') }}
            <img alt="sideBar" :class="advanced.modeImg" src="./images/Side_bar.svg" />
          </label>
        </div>
        <div :class="advanced.radioGroup">
          <input
            id="popUp"
            :checked="store.config.displayMode == 'popUp'"
            name="mode"
            type="radio"
            @input="changeMode('popUp')"
          />
          <label for="popUp">
            {{ $gettext('Pop Up') }}
            <img alt="popUp" :class="advanced.modeImg" src="./images/Pop_up.svg" />
          </label>
        </div>
      </div>

      <span :class="[advanced.subtitle, advanced.activeWebpilotTitle]">{{
        $gettext('Active Webpilot')
      }}</span>
      <div :class="advanced.activeWebpilot">
        <SwitchButton v-model="store.config.autoPopup" @on-change="onAutoPopupChange" />
        <div :class="advanced.activeWebpilotDesc">
          {{ $gettext('Display Webpilot') }} <img :src="WebpilotLogo" />
          {{ $gettext('when text is selected') }}
        </div>
      </div>

      <span :class="advanced.subtitle">{{ $gettext('Change Shortcut') }}</span>
      <div :class="advanced.shortcut">
        <ShortcutInput
          v-model="shortcutKeys"
          style="margin-top: 8px; margin-bottom: 22px"
          @change="onChangeShortcut"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import WebpilotLogo from 'data-base64:~assets/icon.png'

import {computed, ref} from 'vue'
import {storeToRefs} from 'pinia'

import Popper from 'vue3-popper'

import useStore from '@/stores/store'
import useUserStore from '@/stores/user'
import useAskAi from '@/hooks/useAskAi'
import WebpilotAlert from '@/components/WebpilotAlert.vue'
import WebpilotButton from '@/components/WebpilotButton.vue'
import ShortcutInput from '@/components/ShortcutInput.vue'

import {$gettext} from '@/utils/i18n'
import {WEBPILOT_OPENAI} from '@/config'

import SwitchButton from './components/SwitchButton.vue'

const userStore = useUserStore()
const {usage} = storeToRefs(userStore)
const {getUsage} = userStore

getUsage()

const store = useStore()

const {loading, success, error, askAi} = useAskAi()

const {config} = storeToRefs(store)

const selectedOption = ref(config.value.apiOrigin)

const saveAuthKey = ref(config.value.authKey)

/** Edit Auth Key */
const authKey = ref('')
const authKeyPlaceHolder = ref('Enter your API Key from OpenAI')

const updatePlaceHolder = () => {
  const key = saveAuthKey.value

  if (key === '' || !key) {
    authKeyPlaceHolder.value = 'Enter your API Key from OpenAI'
    return 'Enter your API Key from OpenAI'
  }

  const startText = key.substring(0, 3)
  const endText = key.substring(key.length - 4, key.length)
  authKeyPlaceHolder.value = `${startText}...${endText}`
  return `${startText}...${endText}`
}
updatePlaceHolder()

const onEditAuthKey = () => {
  // use saved temp key first
  authKeyPlaceHolder.value = ''

  if (saveAuthKey.value !== '') {
    authKey.value = saveAuthKey.value
    return
  }
  // if can't find local save auhtkey use storeconfig authkey
  const {authKey: key} = config.value
  if (key === '' || !key) return
  saveAuthKey.value = key
}

const onBlurSetAuthkey = () => {
  // if (authKey.value !== '') {
  saveAuthKey.value = authKey.value
  // }

  authKey.value = ''
  updatePlaceHolder()
}

const alertInfo = computed(() => {
  // Alet info for token
  if (!isSelfHost.value) {
    if (success.value) return {type: 'success', tips: 'Successfully added'}
    if (error.value)
      return {type: 'error', tips: 'Incorrect API Key. Please check with the provider'}
  }

  if (success.value) return {type: 'success', tips: 'Successfully added '}
  if (error.value) return {type: 'error', tips: "Can't add this address"}

  return {
    type: '',
    tips: '',
  }
})

// Self Host
const isSelfHost = ref(!!config.value.selfHostUrl)
const selfHostUrl = ref(config.value.selfHostUrl)

const handleOptionChange = event => {
  const {value} = event.target

  selectedOption.value = value

  // switch (value) {
  //   case 'general':
  //     break
  //   default:
  //     break
  // }
}

const onChangePlan = () => {
  selectedOption.value = 'personal'
}

const save = async () => {
  if (
    selectedOption.value === store.config.apiOrigin &&
    saveAuthKey.value === store.config.authKey &&
    selfHostUrl.value === store.config.selfHostUrl
  ) {
    return
  }

  const authKey = selectedOption.value === 'general' ? WEBPILOT_OPENAI.AUTH_KEY : saveAuthKey.value
  const url = selectedOption.value === 'general' ? WEBPILOT_OPENAI.HOST_URL : selfHostUrl.value

  // Check Toekn validation
  await askAi({
    authKey,
    command: 'Say hi.',
    url,
  })

  // 选择 Free API时，authKey 和 selfHostUrl 用于占位，不更新 store
  if (selectedOption.value === 'general') {
    store.setConfig({
      ...store.config,
      isAuth: true,
      isFinishSetup: true,
      apiOrigin: selectedOption.value,
    })
  } else {
    store.setConfig({
      ...store.config,
      apiOrigin: selectedOption.value,
      isAuth: true,
      isFinishSetup: true,
      authKey,
      selfHostUrl: url,
    })
  }
}

const chekcCloseSelfHost = () => {
  if (!isSelfHost.value) selfHostUrl.value = ''
}

// Display Mode
const changeMode = str => {
  store.config.displayMode = str
  store.setConfig(store.config)
}

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

// alert
const hideAlert = () => {
  error.value = false
  success.value = false
}
</script>

<style module="advanced" lang="scss">
.panel {
  display: flex;
  flex-direction: column;
  padding: 16px 24px;
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
    margin-top: 36px;
    color: #292929;
    font-weight: 400;
    font-size: 18px;
    line-height: 25px;
  }

  .displayMode {
    margin-top: 15px;
  }

  .apiProvider {
    margin-top: 16px;
  }

  select,
  input[type='text'][role='authkey'] {
    width: 360px;
    height: 36px;
    margin-top: 8px;
    margin-bottom: 12px;
    padding-left: 8px;

    /* color: #929497; */
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

  p {
    margin: 0;
    font-weight: 400;
    font-size: 12px;
    line-height: 18px;
  }
}

.api {
  min-height: 430px;
}

.general,
.personal {
  color: #585b58;
}

.active {
  color: #292929;
  opacity: 1;
}

.general {
  h4 {
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
  }
}

.radio {
  display: flex;
  align-items: center;
  margin: 16px 0 12px;
  line-height: 25px;

  input {
    width: 16px;
    height: 16px;
    margin: 0 8px 0 0;
    border: 1px solid #4f5aff;
    cursor: pointer;
  }

  label {
    font-size: 18px;
    cursor: pointer;
  }
}

.usage {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-bottom: 6px;
  padding: 0 24px;
  opacity: 0.7;

  p {
    font-size: 14px;
  }
}

.progressBar {
  position: relative;
  width: 300px;
  height: 24px;
  overflow: hidden;
  background: #edeff2;
  border-radius: 20px;

  span {
    display: block;
    height: 100%;
    background: rgb(79 90 255 / 20%);
    border-radius: 20px;
  }

  .none {
    position: absolute;
    top: 0;
    right: 0; /* Adjust the ending position of the lines */
    bottom: 0;
    left: 10px; /* Adjust the starting position of the lines */
    background: none;
    background-image: linear-gradient(to right, rgb(146 148 151 / 20%) 1px, transparent 1px);
    background-repeat: repeat-x;
    background-size: 15px 100%; /* Adjust the width of each line */
    transform: skew(-40deg);
    content: '';
  }
}

.limited {
  display: flex;
  padding: 0 24px;
  font-weight: 500;

  a {
    display: flex;
    align-items: center;
    padding-right: 8px;
    color: #4f5aff;
    text-decoration: underline;
    background: linear-gradient(0deg, rgb(79 90 255 / 10%), rgb(79 90 255 / 10%)), #fff;
    cursor: pointer;
  }
}

.apiItem {
  display: flex;
  flex-direction: column;
}

.haveAuthKey::placeholder {
  color: #929497;
}

.host {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 360px;
  margin-top: 16px;
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

.mode {
  display: flex;
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
  margin-top: 20px !important;
  color: yellow;
}

.activeWebpilot {
  display: flex;
  margin-top: 9px;

  div {
    display: flex;
    align-items: center;
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
    margin: 0 5px;
  }
}

.activeWebpilotDesc {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.activeWebpilotTitle {
  margin-top: 12px !important;
}

.help {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 15px;
  height: 15px;
  color: #585b58;
  border: 1px solid #585b58;
  border-radius: 50%;
  cursor: pointer;

  &:hover {
    color: #fff;
    background: #585b58;
  }
}

:root {
  --popper-theme-background-color: #fff;
  --popper-theme-background-color-hover: #fff;
  --popper-theme-text-color: #585b58;
  --popper-theme-border-width: 1px;
  --popper-theme-border-style: solid;
  --popper-theme-border-color: rgb(220 222 225 / 100%);
  --popper-theme-border-radius: 6px;
  --popper-theme-padding: 6px;
  --popper-theme-box-shadow: 0 6px 30px -6px rgb(0 0 0 / 25%);
}

.popoverText {
  width: 160px;
  font-weight: 500;
}
</style>

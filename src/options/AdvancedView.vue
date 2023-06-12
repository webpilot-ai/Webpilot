<template>
  <div :class="advanced.main">
    <div :class="[advanced.api, advanced.panel]">
      <span :class="advanced.title">{{ $gettext('API Settings') }}</span>
      <!-- <div v-if="isSignedIn === true" :class="advanced.general"> -->
      <div v-if="false" :class="advanced.general">
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
        <div v-if="selectedOption === 'general'">
          <h4>Your Usage</h4>
          <p>{{ usage.current }} / {{ usage.total }}</p>
        </div>
      </div>
      <div :class="advanced.personal">
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
                placeholder="Enter your base address"
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
import {computed, ref} from 'vue'
import {storeToRefs} from 'pinia'

import useStore from '@/stores/store'
import useUserStore from '@/stores/user'
import useAskAi from '@/hooks/useAskAi'
import WebpilotAlert from '@/components/WebpilotAlert.vue'
import WebpilotButton from '@/components/WebpilotButton.vue'
import ShortcutInput from '@/components/ShortcutInput.vue'

import {$gettext} from '@/utils/i18n'
import {WEBPILOT_OPENAI} from '@/config'

import WebpilotLogo from '../../assets/icon.png'

import SwitchButton from './components/SwitchButton.vue'

const userStore = useUserStore()
const {usage} = storeToRefs(userStore)
const {getUsage} = userStore

const store = useStore()

const {loading, success, error, askAi} = useAskAi()

const {config} = storeToRefs(store)

const selectedOption = ref('personal')

const saveAuthKey = ref(config.value.authKey)

/** Edit Auth Key */
const authKey = ref('')
const authKeyPlaceHolder = ref('Enter your API Key from OpenAI')

const updatePlaceHolder = () => {
  const key = saveAuthKey.value === '' ? store.config.authKey : saveAuthKey.value

  if (key === '' || !key) return 'Enter your API Key from OpenAI'

  const startText = key.substring(0, 3)
  const endText = key.substring(key.length - 4, key.length)
  authKeyPlaceHolder.value = `${startText}...${endText}`
  return `${startText}...${endText}`
}
updatePlaceHolder()

const onEditAuthKey = () => {
  // use saved temp key first
  // if (saveAuthKey.value !== '') {
  //   authKey.value = saveAuthKey.value
  //   return
  // }
  // // if can't find local save auhtkey use storeconfig authkey
  // const {authKey: key} = config.value
  // if (key === '' || !key) return
  // saveAuthKey.value = key
  authKeyPlaceHolder.value = ''
}

const onBlurSetAuthkey = () => {
  if (authKey.value !== '') {
    saveAuthKey.value = authKey.value
  }

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

// Model Type
const llmModel = ref(config.value.model.model)

// Self Host
const isSelfHost = ref(!!config.value.selfHostUrl)
const selfHostUrl = ref(config.value.selfHostUrl)

const currentAuthKey = ref(config.value.authKey)
const currentHostUrl = ref(config.value.selfHostUrl)

const handleOptionChange = event => {
  const {value} = event.target

  selectedOption.value = value

  switch (value) {
    case 'general':
      currentAuthKey.value = WEBPILOT_OPENAI.AUTH_KEY
      currentHostUrl.value = WEBPILOT_OPENAI.HOST_URL
      llmModel.value = WEBPILOT_OPENAI.MODEL
      getUsage()
      break
    default:
      currentAuthKey.value = saveAuthKey.value
      currentHostUrl.value = selfHostUrl.value
      llmModel.value = 'gpt-3.5-turbo'
      break
  }
}

const save = async () => {
  store.setConfig({
    ...store.config,
    model: {
      ...store.config.model,
      model: llmModel.value,
    },
  })

  if (
    selectedOption.value === store.config.apiOrigin &&
    currentAuthKey.value === store.config.authKey &&
    currentHostUrl.value === store.config.selfHostUrl
  ) {
    return
  }

  // Check Toekn validation
  await askAi({
    authKey: currentAuthKey.value,
    command: 'Say hi.',
    url: currentHostUrl.value,
  })

  store.setConfig({
    ...store.config,
    apiOrigin: selectedOption.value,
    isAuth: true,
    authKey: saveAuthKey.value,
    isFinishSetup: true,
    selfHostUrl: selfHostUrl.value !== '' ? selfHostUrl.value : '',
  })
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
    color: #929497;
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
</style>

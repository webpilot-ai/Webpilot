<template>
  <div :class="advanced.main">
    <div :class="[advanced.api, advanced.panel]">
      <span :class="advanced.title">API Settings</span>
      <label :class="advanced.subtitle" for="provider">Active API Provider</label>
      <select id="provider" name="provider">
        <option :class="advanced.iconLogo" selected value="open_ai_3.5">
          OpenAI gpt-3.5-terbo
        </option>
        <option value="open_ai_4.0">OpenAI gpt-4.0-terbo</option>
        <option value="baidu_wenxin">百度文心</option>
      </select>
      <img alt="" :class="advanced.dropdown" src="./images/dropdown.png" @click="openSelect" />
      <label for="keys">Your API Key</label>
      <input id="keys" name="keys" :placeholder="placeholder" type="text" />

      <span :class="advanced.links"
        >Visit: <a :href="links" target="_blank">{{ links }}</a></span
      >
      <div :class="advanced.host">
        <div :class="advanced.selfHost">
          <input id="self_host" name="self_host" type="checkbox" /><label for="self_host"
            >Self Host</label
          >
        </div>
        <div :class="advanced.more">
          <img :class="advanced.question_mark" src="./images/help.png" /> More help
        </div>
      </div>

      <div>
        <button :class="advanced.saveButton" @click="save()">SAVE CHANGES</button>
      </div>
    </div>

    <div :class="[advanced.extension, advanced.panel]">
      <span :class="advanced.title">Extension Settings</span>

      <span :class="advanced.subtitle">Display mode</span>
      <div :class="advanced.mode">
        <div :class="advanced.radioGroup">
          <input
            id="sideBar"
            :checked="displayMode == 'siderBar'"
            name="mode"
            type="radio"
            @input="changeMode('sideBar')"
          />
          <label for="sideBar"
            >Side Bar <img alt="sideBar" :class="advanced.modeImg" src="./images/Side_bar.svg"
          /></label>
        </div>
        <div :class="advanced.radioGroup">
          <input
            id="popUp"
            :checked="displayMode == 'popUp'"
            name="mode"
            type="radio"
            @input="changeMode('popUp')"
          />
          <label for="popUp"
            >Pop Up <img alt="popUp" :class="advanced.modeImg" src="./images/Pop_up.svg"
          /></label>
        </div>
      </div>

      <span :class="advanced.subtitle">Active Webpilot</span>
      <div :class="advanced.activeWebpilot">
        <SwitchButton />
        <div :class="advanced.hints">
          Display Webpilot <img alt="" src="./images/default.png" /> when text is selected
        </div>
      </div>

      <span :class="advanced.subtitle">Change Shortcut</span>
      <div :class="advanced.shortcut">
        <input
          name="shortcut"
          placeholder="Ctrl+M"
          type="text"
          @input="saveShortcut($event.target.value)"
        />
        <span @click="shortCut = store.config.customCommand">Reset</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref} from 'vue'

import useConfigStore from '@/stores/config'

import SwitchButton from './components/SwitchButton.vue'

const placeholder = ref('Enter your API Key from OpenAI')
const links = ref('https://platform.openai.com/account/api-keys')

const store = useConfigStore()
const displayMode = ref(store.config.displayMode)
const shortCut = ref(store.config.customCommand)

const changeMode = str => {
  store.config.displayMode = str
  store.setConfig(store.config)
}

const save = () => {}

const saveShortcut = value => {
  store.config.customCommand = value
  store.setConfig(store.config)
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
  input[type='text'] {
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
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    background: url('./images/edit.svg') no-repeat;
    background-size: 22px 22px;
    background-position: 10px center;
    padding-left: 38px;
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

  input {
    width: 16px;
    height: 16px;
    margin-top: 0;
  }

  label {
    margin-top: 0;
    font-size: 14px;
    line-height: 20px;
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
    height: 16px;
    width: 16px;
    vertical-align: middle;
    margin-right: 6px;
  }
}

.mode {
  display: flex;
  margin-top: 10px;
}

.radioGroup {
  display: flex;

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

.saveButton {
  margin-top: 100px;
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
    display: inline;
    height: 16px;
    width: 16px;
    vertical-align: middle;
  }
}

.shortcut {
  margin-bottom: 30px;

  input {
    width: 140px !important;
  }

  span {
    margin-left: 8px;
    color: #585b58;
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    text-decoration: underline;
    cursor: pointer;
  }
}
</style>

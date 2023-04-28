<template>
  <div :class="advanced.main">
    <div :class="[advanced.api, advanced.panel]">
      <span :class="advanced.title"> API Settings </span>
      <label for="provider">Active API Provider</label>
      <select id="provider" name="provider">
        <option selected value="open_ai_3.5">OpenAI gpt-3.5-terbo</option>
        <option value="open_ai_4.0">OpenAI gpt-4.0-terbo</option>
        <option value="baidu_wenxin">百度文心</option>
      </select>

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
        <div :class="advanced.more"><span :class="advanced.question_mark"></span> More help</div>
      </div>

      <div>
        <button :class="advanced.saveButton" @click="save()">SAVE CHANGES</button>
      </div>
    </div>

    <div :class="[advanced.extension, advanced.panel]">
      <span :class="advanced.title"> Extension Settings </span>
    </div>
  </div>
</template>

<script setup>
import {ref} from 'vue'

const placeholder = ref('Enter your API Key from OpenAI')
const links = ref('https://platform.openai.com/account/api-keys')

const save = () => {
  console.log(' form saved !')
}
</script>

<style module="advanced" lang="scss">
.openAiLogo {
  width: 22px;
  height: 22px;
  background-image: url('./images/openAiLogo.png');
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

  label {
    margin-top: 24px;
    color: #292929;
    font-weight: 400;
    font-size: 18px;
    line-height: 25px;
  }

  select,
  input {
    width: 360px;
    height: 36px;
    margin-top: 8px;
    padding-left: 8px;
    font-size: 14px;
    line-height: 20px;
    border: 1px solid #dcdee1;
    border-radius: 5px;
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
  color: #585b58;
  font-size: 14px;
  line-height: 20px;
  text-align: right;
  text-decoration-line: underline;

  .question_mark {
    background-color: #4f5aff;
    background-image: url('./images/question_mark.svg');
    background-size: cover;
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
</style>

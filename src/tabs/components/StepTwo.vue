<template>
  <div :class="stepTwo.wrap">
    <h3>Set up your API Key</h3>
    <div v-if="isSignedIn === true" :class="stepTwo.general">
      <div :class="stepTwo.radio">
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
      <p>You can use Webpilot API for free up to X times</p>
    </div>
    <div :class="stepTwo.personal">
      <div :class="stepTwo.radio">
        <input
          v-if="isSignedIn === true"
          id="option2"
          v-model="selectedOption"
          name="option"
          type="radio"
          value="personal"
          @change="handleOptionChange"
        />
        <label for="option2">Set up your OpenAI API</label>
      </div>
      <div>
        <div :class="stepTwo.apiItem">
          <input
            v-model="authKey"
            :class="stepTwo.input"
            placeholder="Enter your API Key from OpenAI"
            type="text"
            @change="onChange"
          />
          <!-- <WebpilotAlert
            v-if="(error || success) && !isSelfHost"
            :auto-hide="true"
            style="margin-top: 8px"
            :tips="alertInfo.tips"
            :type="alertInfo.type"
            @on-hide="hideAlert"
          /> -->
          <div :class="stepTwo.apiKeyGuide">
            <p>
              To get your API key, log into
              <a href="https://platform.openai.com/account/api-keys" target="_blank">
                Open AI > API Keys</a
              >
            </p>
            <p>Click <b>“Create new secret key”</b>. Copy and paste key above</p>
          </div>

          <div v-if="selectedOption === 'personal'" :class="stepTwo.host">
            <div :class="stepTwo.selfHost">
              <input id="self_host" v-model="isSelfHost" name="self_host" type="checkbox" />
              <label for="self_host">Self Host</label>
            </div>
          </div>
          <!-- <div v-if="isSelfHost" :class="stepTwo.selfHostInput">
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
          </div> -->
        </div>
      </div>
      <template v-if="isSelfHost">
        <input
          v-model="selfHostUrl"
          :class="stepTwo.input"
          placeholder="Enter your base address"
          type="text"
          @change="onChange"
        />
        <HelpTips value="How to self host API?" />
      </template>
    </div>
  </div>
</template>

<script setup>
import {onMounted, ref} from 'vue'
import {storeToRefs} from 'pinia'

import useUserStore from '@/stores/user'

import HelpTips from '@/components/HelpTips.vue'
// import WebpilotAlert from '@/components/WebpilotAlert.vue'

const userStore = useUserStore()
const {isSignedIn} = storeToRefs(userStore)

const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
  },
})

const emits = defineEmits(['update:modelValue', 'change'])

const selectedOption = ref(props.modelValue.selectedOption)
const authKey = ref(props.modelValue.authKey)
const isSelfHost = ref(false)
const selfHostUrl = ref(props.modelValue.selfHostUrl)

onMounted(() => {
  if (props.modelValue.selfHostUrl !== '') {
    isSelfHost.value = true
  }
})

const handleOptionChange = event => {
  const {value} = event.target

  selectedOption.value = value

  switch (value) {
    case 'general':
      emits('update:modelValue', {
        selectedOption: 'general',
      })
      break
    default:
      emits('update:modelValue', {
        selectedOption: 'personal',
      })

      break
  }
}

const onChange = () => {
  if (selectedOption.value === 'general') {
    return
  }
  emits('update:modelValue', {
    authKey: authKey.value,
    selfHostUrl: selfHostUrl.value,
  })
}
</script>

<style module="stepTwo" lang="scss">
.wrap {
  .openAiIcon {
    width: 24px;
    height: 24px;
    margin-right: 8px;
  }

  .header {
    display: flex;
    align-items: center;
    font-weight: 400;
    font-size: 18px;
    line-height: 25px;
  }

  h3 {
    margin: 0 0 16px;
    font-weight: 400;
    font-size: 24px;
    line-height: 34px;
    text-align: center;
  }
}

.input {
  width: 360px;
  height: 36px;
  margin: 8px 0 12px;
  padding: 8px;
  font-size: 14px;
  line-height: 20px;
  border: 1px solid #dcdee1;
  border-radius: 5px;

  &:focus {
    outline: none;
  }
}

.general {
  h4 {
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
  }

  p {
    padding: 0 25px;
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

  p {
    margin: 0;
    font-weight: 400;
    font-size: 12px;
    line-height: 18px;
  }
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
</style>

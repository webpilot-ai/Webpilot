<template>
  <div :class="stepTwo.wrap">
    <h3>{{ $gettext('Choosing Service') }}</h3>
    <div :class="[stepTwo.general, selectedOption === 'general' ? stepTwo.active : '']">
      <!-- <div v-if="false" :class="stepTwo.general"> -->
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
      <p v-if="selectedOption === 'general'">Use Webpilot API for FREE up to 50 times/week</p>
    </div>
    <div :class="[stepTwo.personal, selectedOption === 'personal' ? stepTwo.active : '']">
      <div :class="stepTwo.radio">
        <input
          id="option2"
          v-model="selectedOption"
          name="option"
          type="radio"
          value="personal"
          @change="handleOptionChange"
        />
        <label for="option2">{{ $gettext('OpenAI(Default)') }}</label>
      </div>
      <div>
        <div v-if="selectedOption === 'personal'" :class="stepTwo.apiItem">
          <input
            v-model="authKey"
            :class="stepTwo.input"
            :placeholder="$gettext('Enter your API Key')"
            type="text"
            @input="onChange"
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
              {{ $gettext('To get it, open this link and click “Create new secret key”.') }}
              <a href="https://platform.openai.com/account/api-keys" target="_blank">
                Open AI > API Keys</a
              >
            </p>
          </div>

          <div v-if="selectedOption === 'personal'" :class="stepTwo.host">
            <div :class="stepTwo.selfHost">
              <input id="self_host" v-model="isSelfHost" name="self_host" type="checkbox" />
              <label for="self_host">{{ $gettext('Self Host') }}</label>
            </div>

            <template v-if="isSelfHost">
              <input
                v-model="selfHostUrl"
                :class="stepTwo.input"
                :placeholder="$gettext('https://api.openai.com')"
                type="text"
                @change="onChange"
              />
              <HelpTips
                url="https://github.com/webpilot-ai/ai-proxy"
                :value="$gettext('How to self host API?')"
              />
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {onMounted, ref} from 'vue'
// import {storeToRefs} from 'pinia'

// import useUserStore from '@/stores/user'

import HelpTips from '@/components/HelpTips.vue'
import {$gettext} from '@/utils/i18n'

// const userStore = useUserStore()
// const {isSignedIn} = storeToRefs(userStore)

const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
  },
})

const emits = defineEmits(['update:modelValue', 'change'])

const selectedOption = ref(props.modelValue.selectedOption)
// const selectedOption = ref('personal')
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

  emits('update:modelValue', {
    authKey: authKey.value,
    selfHostUrl: selfHostUrl.value,
    selectedOption: value,
  })
}

const onChange = () => {
  emits('update:modelValue', {
    authKey: authKey.value,
    selfHostUrl: selfHostUrl.value,
    selectedOption: selectedOption.value,
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

  h3 {
    margin: 0 0 16px;
    color: #4f5aff;
    font-weight: 400;
    font-size: 24px;
    line-height: 34px;
    text-align: center;
  }
}

.general,
.personal {
  color: #585b58;
}

.active {
  color: #292929;
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
  margin: 0 0 36px;

  h4 {
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
  }

  p {
    margin: 0 24px;
    padding: 0 25px;
    color: #292929;
    background-image: url('../images/icon-gift.png');
    background-repeat: no-repeat;
    background-size: 16px 16px;
  }
}

.radio {
  display: flex;
  align-items: center;
  margin: 0 0 4px;
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

.host {
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

<template>
  <section :class="stepTwo.wrap">
    <WelcomeTitle @on-prev="goBack">{{ $gettext('Set up API') }}</WelcomeTitle>
    <ol :class="stepTwo.selector">
      <li
        :class="[
          stepTwo['selector__radio'],
          {[stepTwo['selector__radio--active']]: selectedOption === 'general'},
        ]"
      >
        <input
          id="option1"
          v-model="selectedOption"
          name="option"
          type="radio"
          value="general"
          @change="handleOptionChange"
        />
        <label for="option1">{{ $gettext('Webpilot Credit') }}</label>
      </li>
      <li
        :class="[
          stepTwo['selector__radio'],
          {[stepTwo['selector__radio--active']]: selectedOption === 'personal'},
        ]"
      >
        <input
          id="option2"
          v-model="selectedOption"
          name="option"
          type="radio"
          value="personal"
          @change="handleOptionChange"
        />
        <label for="option2">{{ $gettext('OpenAI Credits') }}</label>
      </li>
    </ol>
    <article>
      <section v-if="selectedOption === 'general'" :class="stepTwo.introduction">
        <article :class="stepTwo['introduction-detail']">
          <span
            >{{ $gettext('Enjoy Webpilot AI for') }} <b>{{ $gettext('FREE') }}</b></span
          >
          <span>{{ $gettext('up to 50 times/week') }}</span>
          <p>{{ $gettext('For more usage, you can add a paid plan later') }}</p>
        </article>
        <ImageFreePlan />
      </section>
      <section v-if="selectedOption === 'personal'" :class="stepTwo.configuration">
        <ServerTypeSelector v-model="serverName" :class="stepTwo['dropdown-menu']" />

        <template v-if="serverName === SERVER_NAME.OPENAI_OFFICIAL">
          <WebpilotInput
            v-model="openAIOfficialFrom.apiKey"
            :class="stepTwo.gap"
            placeholder="API key from OpenAI"
          />

          <SettingAlert
            v-if="success || error"
            :class="stepTwo.gap"
            :color="success ? '#318619' : '#CC0000'"
            inline:title="success ? 'Successfully added API Key' : 'Invalid Key'"
          >
            <template #icon>
              <IconAlertSuccess v-if="success" />
              <IconAlertError v-else />
            </template>
          </SettingAlert>

          <article :class="[stepTwo.guide]">
            <SettingAlert :class="stepTwo['guide-content']" title="How">
              <template #desc>
                Log into
                <a href="https://platform.openai.com/account/api-keys" target="_blank">
                  Open AI > API Keys</a
                >. Click “Create new secret key”, and get yours.
              </template>
            </SettingAlert>
          </article>
        </template>

        <template v-else-if="serverName === SERVER_NAME.OPENAI_PROXY">
          <WebpilotInput
            v-model="openAiProxyForm.apiKey"
            :class="stepTwo.gap"
            placeholder="OPENAI_API_KEY"
          />
          <WebpilotInput
            v-model="openAiProxyForm.apiHost"
            :class="stepTwo.gap"
            placeholder="OPENAI_API_HOST"
          />
        </template>

        <template v-else-if="serverName === SERVER_NAME.AZURE_PROXY">
          <WebpilotInput
            v-model="azureProxyForm.apiKey"
            :class="stepTwo.gap"
            placeholder="API_KEY"
          />
          <WebpilotInput
            v-model="azureProxyForm.apiHost"
            :class="stepTwo.gap"
            placeholder="API_HOST"
          />
          <WebpilotInput
            v-model="azureProxyForm.apiVersion"
            :class="stepTwo.gap"
            placeholder="API_VERSION"
          />
          <WebpilotInput
            v-model="azureProxyForm.deploymentID"
            :class="stepTwo.gap"
            placeholder="DEPLOYMENT_ID"
          />
        </template>
      </section>
      <!-- <div v-if="selectedOption === 'personal'" :class="stepTwo.apiItem">
        <input
          v-model="authKey"
          :class="stepTwo.input"
          :placeholder="$gettext('Enter your API Key')"
          type="text"
          @input="handleAPIKeyChange"
        />
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
      </div> -->
    </article>
  </section>
</template>

<script setup>
import {onMounted, reactive, ref} from 'vue'

import useStore from '@/stores/store'
// import {API_ORIGINS, OPENAI_BASE_URL, SERVER_NAME} from '@/config'
import {API_ORIGINS, SERVER_NAME} from '@/config'
import {$gettext} from '@/utils/i18n'

import ImageFreePlan from '@/components/image/ImageFreePlan.vue'
import IconAlertSuccess from '@/components/icon/IconAlertSuccess.vue'
import IconAlertError from '@/components/icon/IconAlertError.vue'

import SettingAlert from '@/options/components/SettingAlert.vue'
import ServerTypeSelector from '@/options/components/ServerTypeSelector.vue'
import WebpilotInput from '@/options/components/WebpilotInput.vue'

import WelcomeTitle from './WelcomeTitle.vue'

// const handleAPIKeyChange = () => {
//   emits('update:modelValue', {
//     authKey: authKey.value,
//     selfHostUrl: selfHostUrl.value,
//     selectedOption: selectedOption.value,
//   })
// }

const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
  },
})
const store = useStore()
const emits = defineEmits(['update:modelValue', 'change'])
const selectedOption = ref(props.modelValue.selectedOption)
const authKey = ref(props.modelValue.authKey)
const isSelfHost = ref(false)
const selfHostUrl = ref(props.modelValue.selfHostUrl)
const serverName = ref(SERVER_NAME.OPENAI_OFFICIAL)

const openAIOfficialFrom = reactive({
  apiKey: '',
})

const openAiProxyForm = reactive({
  apiKey: '',
  apiHost: '',
})

const azureProxyForm = reactive({
  apiKey: '',
  apiHost: '',
  apiVersion: '',
  deploymentID: '',
})

onMounted(() => {
  if (props.modelValue.selfHostUrl !== '') isSelfHost.value = true
})

const handleOptionChange = event => {
  const {value} = event.target
  selectedOption.value = value
  emits('update:modelValue', {
    authKey: authKey.value,
    selfHostUrl: selfHostUrl.value,
    selectedOption: value,
  })

  const {apiOrigin} = store.config

  if (apiOrigin === API_ORIGINS.OPENAI) {
    const {authKey} = store.config
    serverName.value = SERVER_NAME.OPENAI_OFFICIAL
    openAIOfficialFrom.apiKey = authKey
  } else if (apiOrigin === API_ORIGINS.OPENAI_PROXY) {
    const {authKey, selfHostUrl} = store.config
    serverName.value = SERVER_NAME.OPENAI_PROXY
    openAiProxyForm.apiKey = authKey
    openAiProxyForm.apiHost = selfHostUrl
  } else if (apiOrigin === API_ORIGINS.AZURE) {
    const {authKey, selfHostUrl, azureApiVersion, azureDeploymentID} = store.config
    serverName.value = SERVER_NAME.AZURE_PROXY
    azureProxyForm.apiHost = selfHostUrl
    azureProxyForm.apiKey = authKey
    azureProxyForm.apiVersion = azureApiVersion
    azureProxyForm.deploymentID = azureDeploymentID
  }
}
</script>

<style module="stepTwo" lang="scss">
.selector {
  display: flex;
  justify-content: space-between;
  width: 316px;
  margin: 0 auto 24px;
  margin-top: 36px;
  padding: 0;
}

.selector__radio {
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
    font-size: 14px;
    line-height: 1;
    cursor: pointer;
  }

  &--active label {
    color: #292929;
    font-weight: 600;
  }
}

.introduction {
  text-align: center;
}

.introduction-detail {
  box-sizing: border-box;
  width: 377px;
  height: 98px;
  margin: 0 auto;
  padding: 12px;
  color: #292929;
  background-color: #f8faff;
  border-radius: 10px;

  span {
    display: block;
    font-weight: 400;
    font-size: 18px;
  }

  b {
    color: #4f5aff;
    font-weight: 600;
  }

  p {
    margin: 4px 0 0;
    color: #929497;
    font-weight: 400;
    font-size: 14px;
    line-height: 1;
  }
}

.configuration {
  padding-bottom: 24px;
  text-align: center;

  .gap {
    margin-top: 24px;
  }

  .dropdown-menu {
    display: inline-block;
  }

  .guide {
    width: 360px;
    margin: 24px auto 0;
  }

  .guide-content {
    text-align: left;
  }
}
</style>

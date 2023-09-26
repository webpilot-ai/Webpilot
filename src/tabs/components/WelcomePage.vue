<template>
  <section :class="setup.container">
    <article :class="setup.form">
      <ul :class="setup.steps">
        <li
          v-for="(item, index) in steps"
          :key="index"
          :class="{[setup.stepItem]: true, [setup.stepItemActive]: stepIndex === item}"
        >
          {{ item }}
        </li>
      </ul>
      <div :class="setup.infoInputArea">
        <!-- Step One has been deprecated-->
        <StepTwo
          v-if="stepIndex === 2"
          v-model="authInfo"
          :error="error"
          :error-message="errorMessage"
          :is-freezing="buttonDisabled"
          :is-warning="showWarn"
          :loading="loading"
          :success="success"
          @on-next="handleNextBtn"
          @on-prev="handleGoBackBtn"
          @on-refresh="clearStatus"
        />
        <StepThree
          v-else-if="stepIndex === 3"
          @on-next="handleNextBtn"
          @on-prev="handleGoBackBtn"
        />
        <StepFour v-else-if="stepIndex === 4" @on-next="handleNextBtn" @on-prev="handleGoBackBtn" />
      </div>
    </article>
    <IconLogoAndText />
  </section>
</template>

<script setup>
import '@assets/styles/reset.scss'

// import {ref, computed, onMounted} from 'vue'
import {ref, computed} from 'vue'

import useAskAi from '@/hooks/useAskAi'
import useStore from '@/stores/store'
import useUserStore from '@/stores/user'
import IconLogoAndText from '@/components/icon/IconLogoAndText.vue'
import {API_ORIGINS, OPENAI_BASE_URL, SERVER_NAME, WEBPILOT_OPENAI} from '@/config'

import StepTwo from './StepTwo.vue'
import StepThree from './StepThree.vue'
import StepFour from './StepFour.vue'

const DEFAULT_SERVICE = 'general'
// const CUSTOM_SERVICE = 'personal'
const {askAi, success, error, loading, errorMessage} = useAskAi()
const steps = [1, 2, 3, 4]
const userStore = useUserStore()
const storeConfig = useStore()
const {getUser} = userStore
getUser()

const stepIndex = ref(2)
const showWarn = ref(false)
const authInfo = ref({
  selectedOption: storeConfig.config.apiOrigin,
  serverName: SERVER_NAME.OPENAI_OFFICIAL,
  openAIOfficialForm: {
    apiKey: storeConfig.config.authKey,
  },
  openAiProxyForm: {
    apiKey: storeConfig.config.authKey,
    apiHost: storeConfig.config.selfHostUrl,
  },
  azureProxyForm: {
    apiKey: storeConfig.config.authKey,
    apiHost: storeConfig.config.selfHostUrl,
    apiVersion: storeConfig.config.azureApiVersion,
    deploymentID: storeConfig.config.azureDeploymentID,
  },
})
// onMounted(() => {
//   const {apiOrigin} = storeConfig.config

//   if (apiOrigin === DEFAULT_SERVICE) {
//     authInfo.value.selectedOption = DEFAULT_SERVICE
//     return
//   }
//   authInfo.value.selectedOption = CUSTOM_SERVICE

//   if (apiOrigin === API_ORIGINS.OPENAI) {
//     authInfo.value.serverName = SERVER_NAME.OPENAI_OFFICIAL
//     authInfo.value.openAIOfficialForm.apiKey = storeConfig.config.authKey
//   } else if (apiOrigin === API_ORIGINS.OPENAI_PROXY) {
//     authInfo.value.serverName = SERVER_NAME.OPENAI_PROXY
//     const {authKey, selfHostUrl} = storeConfig.config
//     authInfo.value.openAiProxyForm = {
//       apiKey: authKey,
//       apiHost: selfHostUrl,
//     }
//   } else if (apiOrigin === API_ORIGINS.AZURE) {
//     authInfo.value.serverName = SERVER_NAME.AZURE_PROXY
//     const {authKey, selfHostUrl, azureApiVersion, azureDeploymentID} = storeConfig.config
//     authInfo.value.azureProxyForm = {
//       apiHost: selfHostUrl,
//       apiKey: authKey,
//       apiVersion: azureApiVersion,
//       deploymentID: azureDeploymentID,
//     }
//   }
// })

const handleNextBtn = async () => {
  if (stepIndex.value === 2) {
    if (await saveForm()) stepIndex.value = 3
  } else if (stepIndex.value === 3) {
    stepIndex.value++
  } else if (stepIndex.value === 4) {
    window.close()
  }
}
const handleGoBackBtn = () => {
  if (stepIndex.value === 2) {
    chrome.tabs.goBack()
  } else {
    stepIndex.value -= 1
  }
}
const clearStatus = () => {
  loading.value = false
  error.value = false
  success.value = false
}
const goToLogin = () => {
  const signURL = 'https://account.webpilot.ai/'
  chrome.tabs.getCurrent(tab => {
    const tabId = tab.id
    chrome.tabs.update(tabId, {url: signURL})
  })
}

const buttonDisabled = computed(() => {
  if (authInfo.value.selectedOption === DEFAULT_SERVICE) return false
  const {serverName} = authInfo.value

  if (serverName === SERVER_NAME.OPENAI_OFFICIAL) {
    const {apiKey} = authInfo.value.openAIOfficialForm
    return !apiKey || apiKey === ''
  }

  if (serverName === SERVER_NAME.OPENAI_PROXY) {
    const {apiKey, apiHost} = authInfo.value.openAiProxyForm
    return !apiKey || apiKey === '' || !apiHost || apiHost === ''
  }

  if (serverName === SERVER_NAME.AZURE_PROXY) {
    const {apiKey, apiHost, apiVersion, deploymentID} = authInfo.value.azureProxyForm

    if (!apiKey || apiKey === '') return true
    if (!apiHost || apiHost === '') return true
    if (!apiVersion || apiVersion === '') return true
    if (!deploymentID || deploymentID === '') return true
  }

  return false
})

const saveForm = async () => {
  showWarn.value = false
  const {selectedOption} = authInfo.value
  const info = {command: 'Say hi'}
  const generalMode = selectedOption === DEFAULT_SERVICE
  try {
    const {serverName} = authInfo.value
    if (generalMode) {
      info.authKey = WEBPILOT_OPENAI.AUTH_KEY
    } else if (serverName === SERVER_NAME.OPENAI_OFFICIAL) {
      // OpenAI Official
      const {openAIOfficialForm} = authInfo.value
      info.authKey = openAIOfficialForm.apiKey
      info.url = OPENAI_BASE_URL
      info.apiOrigin = API_ORIGINS.OPENAI
    } else if (serverName === SERVER_NAME.OPENAI_PROXY) {
      // OpenAIProxy
      const {openAiProxyForm} = authInfo.value
      info.authKey = openAiProxyForm.apiKey
      info.url = openAiProxyForm.apiHost
      info.apiOrigin = API_ORIGINS.OPENAI_PROXY
    } else if (serverName === SERVER_NAME.AZURE_PROXY) {
      // Azure API
      const {azureProxyForm} = authInfo.value
      info.authKey = azureProxyForm.apiKey
      info.url = `https://${azureProxyForm.apiHost}.openai.azure.com/openai/deployments/${azureProxyForm.deploymentID}/chat/completions?api-version=${azureProxyForm.apiVersion}`
      info.apiOrigin = API_ORIGINS.AZURE
    } else {
      throw new Error('api not match')
    }
    await askAi(info)

    const data = {
      ...storeConfig.config,
      isAuth: true,
      isFinishSetup: true,
      apiOrigin: selectedOption,
    }
    if (!generalMode) {
      data.apiOrigin = info.apiOrigin
      data.authKey = info.authKey
      data.selfHostUrl = info.url
      if (serverName === SERVER_NAME.AZURE_PROXY) {
        const {azureProxyForm} = authInfo.value
        data.selfHostUrl = azureProxyForm.apiHost
        data.azureApiVersion = azureProxyForm.apiVersion
        data.azureDeploymentID = azureProxyForm.deploymentID
      }
    }
    storeConfig.setConfig(data)
    stepIndex.value = 3
  } catch (error) {
    if (generalMode && error?.response?.status === 401) {
      goToLogin()
      storeConfig.setConfig({...storeConfig.config, apiOrigin: selectedOption})
      return
    }
    showWarn.value = true
    if (error?.response?.status === 402) {
      storeConfig.setConfig({
        ...storeConfig.config,
        isAuth: true,
        isFinishSetup: true,
      })
      setTimeout(() => {
        stepIndex.value = 3
        showWarn.value = false
      }, 600)
    }
  }
}
</script>

<style module="setup" lang="scss">
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  width: 100vw;
  height: 100vh;
  padding-bottom: 24px;
  background-color: #edeff2;
}

.form {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 560px;
}

.steps {
  display: flex;
  flex-direction: row;
  margin: 0;
  margin-bottom: 32px;
  padding: 0;
  list-style-type: none;
}

.stepItem {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  color: #4f5aff;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  background: rgb(255 255 255 / 60%);
  border: 1px solid #fff;
  border-radius: 50%;
  user-select: none;
}

.stepItem + .stepItem {
  margin-left: 24px;
}

.stepItemActive {
  color: #fff;
  background-color: #4f5aff;
  border: none;
}

.infoInputArea {
  display: flex;
  flex-direction: column;
  width: 560px;
  min-height: 480px;
  padding: 36px;
  background-color: #fff;
  border-radius: 20px;
  box-shadow: 0 8px 24px 0 rgb(149 157 165 / 20%);
}
</style>

<template>
  <div :class="$style['openai-credit-wrap']">
    <ServerTypeSelector v-model="serverName" />

    <template v-if="serverName === SERVER_NAME.OPENAI_OFFICIAL">
      <WebpilotInput v-model="openAIOfficialForm.apiKey" placeholder="API key from OpenAI" />

      <SettingAlert
        v-if="success || error"
        :color="success ? '#318619' : '#CC0000'"
        inline
        :title="success ? 'Successfully added API Key' : 'Invalid Key'"
      >
        <template #icon>
          <IconAlertSuccess v-if="success" />
          <IconAlertError v-else />
        </template>
      </SettingAlert>

      <div :class="$style['openai-guide']">
        <SettingAlert title="How">
          <template #desc>
            Log into
            <a href="https://platform.openai.com/account/api-keys" target="_blank">
              Open AI > API Keys</a
            >. Click “Create new secret key”, and get yours.
          </template>
        </SettingAlert>
      </div>
    </template>

    <template v-else-if="serverName === SERVER_NAME.OPENAI_PROXY">
      <WebpilotInput v-model="openAiProxyForm.apiKey" placeholder="OPENAI_API_KEY" />
      <WebpilotInput v-model="openAiProxyForm.apiHost" placeholder="OPENAI_API_HOST" />
    </template>

    <template v-else-if="serverName === SERVER_NAME.AZURE_PROXY">
      <WebpilotInput v-model="azureProxyForm.apiKey" placeholder="API_KEY" />
      <WebpilotInput v-model="azureProxyForm.apiHost" placeholder="API_HOST" />
      <WebpilotInput v-model="azureProxyForm.apiVersion" placeholder="API_VERSION" />
      <WebpilotInput v-model="azureProxyForm.deploymentID" placeholder="DEPLOYMENT_ID" />
    </template>

    <div :class="$style['btn-wrap']">
      <WebpilotButton
        :class="$style['save-btn']"
        :disabled="isDisableSaveConfig"
        :loading="loading"
        value="SAVE CHANGES"
        @click="save"
      />
      <template v-if="serverName === SERVER_NAME.AZURE_PROXY">
        <SettingAlert
          v-if="success || error"
          :color="success ? '#318619' : '#CC0000'"
          inline
          :title="success ? 'Success' : 'Failed to update'"
        >
          <template #icon>
            <IconAlertSuccess v-if="success" />
            <IconAlertError v-else />
          </template>
        </SettingAlert>
      </template>
    </div>
  </div>
</template>
<script setup lang="ts">
import {computed, reactive, ref, onMounted, watch} from 'vue'

import {API_ORIGINS, OPENAI_BASE_URL, SERVER_NAME} from '@/config'
import useAskAi from '@/hooks/useAskAi'
import WebpilotButton from '@/components/WebpilotButton.vue'
import useStore from '@/stores/store'
import IconAlertSuccess from '@/components/icon/IconAlertSuccess.vue'
import IconAlertError from '@/components/icon/IconAlertError.vue'

import ServerTypeSelector from './ServerTypeSelector.vue'
import WebpilotInput from './WebpilotInput.vue'
import SettingAlert from './SettingAlert.vue'

const store = useStore()

const openAIOfficialForm = reactive({
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

const serverName = ref(SERVER_NAME.OPENAI_OFFICIAL)

onMounted(() => {
  const {apiOrigin} = store.config

  if (apiOrigin === API_ORIGINS.OPENAI) {
    const {authKey} = store.config
    serverName.value = SERVER_NAME.OPENAI_OFFICIAL
    openAIOfficialForm.apiKey = authKey
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
})

const isDisableSaveConfig = computed(() => {
  if (serverName.value === SERVER_NAME.OPENAI_OFFICIAL) {
    const {apiKey} = openAIOfficialForm
    return apiKey === '' || !apiKey
  }

  if (serverName.value === SERVER_NAME.OPENAI_PROXY) {
    const {apiKey, apiHost} = openAiProxyForm
    return apiKey === '' || !apiKey || apiHost === '' || !apiHost
  }

  if (serverName.value === SERVER_NAME.AZURE_PROXY) {
    const {apiKey, apiHost, apiVersion, deploymentID} = azureProxyForm

    if (apiKey === '' || !apiKey) return true
    if (apiHost === '' || !apiHost) return true
    if (apiVersion === '' || !apiVersion) return true
    if (deploymentID === '' || !deploymentID) return true
  }

  return false
})

const {loading, success, error, askAi} = useAskAi()

const save = async () => {
  // check config change

  // check token
  try {
    let authKey = ''
    let apiHost = ''
    let apiOrigin = API_ORIGINS.OPENAI

    // OpenAI Official
    if (serverName.value === SERVER_NAME.OPENAI_OFFICIAL) {
      authKey = openAIOfficialForm.apiKey
      apiHost = OPENAI_BASE_URL
    }

    // OpenAIProxy
    if (serverName.value === SERVER_NAME.OPENAI_PROXY) {
      authKey = openAiProxyForm.apiKey
      apiHost = openAiProxyForm.apiHost
      apiOrigin = API_ORIGINS.OPENAI_PROXY
    }

    // Azure API
    if (serverName.value === SERVER_NAME.AZURE_PROXY) {
      apiOrigin = API_ORIGINS.AZURE
      authKey = azureProxyForm.apiKey
      apiHost = `https://${azureProxyForm.apiHost}.openai.azure.com/openai/deployments/${azureProxyForm.deploymentID}/chat/completions?api-version=${azureProxyForm.apiVersion}`
    }

    await askAi({
      authKey,
      command: 'Say hi',
      url: apiHost,
      apiOrigin,
      azureApiVersion: azureProxyForm.apiVersion === '' ? null : azureProxyForm.apiVersion,
      azureDeploymentID: azureProxyForm.deploymentID === '' ? null : azureProxyForm.deploymentID,
    })

    // update config
    if (serverName.value !== SERVER_NAME.AZURE_PROXY) {
      store.setConfig({
        ...store.config,
        apiOrigin,
        isAuth: true,
        isFinishSetup: true,
        authKey,
        selfHostUrl: apiHost,
      })
    } else {
      store.setConfig({
        ...store.config,
        apiOrigin,
        isAuth: true,
        isFinishSetup: true,
        authKey,
        selfHostUrl: azureProxyForm.apiHost,
        azureApiVersion: azureProxyForm.apiVersion,
        azureDeploymentID: azureProxyForm.deploymentID,
      })
    }
  } catch (error) {}
}

watch(serverName, (newValue, oldValue) => {
  if (newValue !== oldValue) {
    loading.value = false
    error.value = false
    success.value = false
  }
})
</script>

<style lang="scss" module>
.openai-credit-wrap {
  display: grid;
  row-gap: 16px;
}

.btn-wrap {
  display: flex;
  align-items: center;
  margin-top: 24px;
  column-gap: 16px;
}

.save-btn {
  width: 143px;
}
</style>

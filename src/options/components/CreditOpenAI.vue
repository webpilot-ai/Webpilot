<template>
  <div :class="$style['openai-credit-wrap']">
    <ServerTypeSelector v-model="serverName" @change="onServerTypeChange" />

    <template v-if="serverName === SERVER_NAME.OPENAI_OFFICIAL">
      <WebpilotInput v-model="openAIOfficialFrom.apiKey" placeholder="API key from OpenAI" />
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

    <WebpilotButton
      :class="$style['save-btn']"
      :disalbed="isDisableSaveConfig"
      value="SAVE CHANGES"
    />
    isDisableSaveConfig: {{ isDisableSaveConfig }}
  </div>
</template>
<script setup lang="ts">
import {computed, reactive, ref} from 'vue'

import {SERVER_NAME} from '@/config'
import WebpilotButton from '@/components/WebpilotButton.vue'

import ServerTypeSelector from './ServerTypeSelector.vue'
import WebpilotInput from './WebpilotInput.vue'
import SettingAlert from './SettingAlert.vue'

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

const serverName = ref(SERVER_NAME.OPENAI_OFFICIAL)

const isDisableSaveConfig = computed(() => {
  if (serverName.value === SERVER_NAME.OPENAI_OFFICIAL) {
    const {apiKey} = openAIOfficialFrom
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
</script>

<style lang="scss" module>
.openai-credit-wrap {
  display: grid;
  row-gap: 16px;
}

.save-btn {
  width: 143px;
  margin-top: 24px;
}
</style>

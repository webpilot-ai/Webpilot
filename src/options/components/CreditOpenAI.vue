<template>
  <div :class="$style['openai-credit-wrap']">
    <ServerTypeSelector v-model="serverName" />
    <WebpilotInput v-model="form.apiKey" placeholder="API_KEY" />

    <template v-if="!isAzure">
      <WebpilotInput v-model="form.baseUrl" placeholder="BASE_URL" />
      <WebpilotInput v-model="form.endpointPath" placeholder="ENDPOINT_PATH" />
    </template>

    <template v-else>
      <WebpilotInput v-model="form.baseUrl" placeholder="AZURE_RESOURCE_NAME" />
      <WebpilotInput v-model="form.azureApiVersion" placeholder="API_VERSION" />
      <WebpilotInput v-model="form.azureDeploymentID" placeholder="DEPLOYMENT_ID" />
    </template>

    <WebpilotInput v-model="form.authHeaderName" placeholder="AUTH_HEADER_NAME" />
    <WebpilotInput v-model="form.authPrefix" placeholder="AUTH_PREFIX (optional)" />

    <div :class="$style['model-settings']">
      <div :class="$style['section-title']">Model</div>
      <select v-model="form.modelId" :class="$style['model-select']">
        <option value="" disabled>Select model</option>
        <option v-for="model in form.modelList" :key="model" :value="model">
          {{ model }}
        </option>
      </select>
      <div :class="$style['model-input-wrap']">
        <WebpilotInput v-model="modelInput" placeholder="Custom model code" />
        <WebpilotButton value="ADD" :class="$style['add-btn']" @click="onAddModel" />
      </div>
      <div :class="$style['model-tags']">
        <button
          v-for="model in form.modelList"
          :key="model"
          :class="$style['model-tag']"
          @click="onRemoveModel(model)"
        >
          {{ model }} ×
        </button>
      </div>
    </div>

    <SettingAlert
      v-if="success || error"
      :color="success ? '#318619' : '#CC0000'"
      inline
      :title="success ? 'Saved successfully' : 'Validation failed'"
    >
      <template #icon>
        <IconAlertSuccess v-if="success" />
        <IconAlertError v-else />
      </template>
    </SettingAlert>

    <div :class="$style['btn-wrap']">
      <WebpilotButton
        :class="$style['save-btn']"
        :disabled="isDisableSaveConfig"
        :loading="loading"
        value="SAVE CHANGES"
        @click="save"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import {computed, reactive, ref, onMounted, watch} from 'vue'

import {
  API_ORIGINS,
  OPENAI_BASE_URL,
  PROVIDER_REGISTRY,
  PROVIDER_ID,
  AUTH_TYPE,
} from '@/config'
import useAskAi from '@/hooks/useAskAi'
import WebpilotButton from '@/components/WebpilotButton.vue'
import useStore from '@/stores/store'
import IconAlertSuccess from '@/components/icon/IconAlertSuccess.vue'
import IconAlertError from '@/components/icon/IconAlertError.vue'

import ServerTypeSelector from './ServerTypeSelector.vue'
import WebpilotInput from './WebpilotInput.vue'
import SettingAlert from './SettingAlert.vue'

const store = useStore()

const form = reactive({
  providerId: PROVIDER_ID.OPENAI,
  apiKey: '',
  baseUrl: OPENAI_BASE_URL,
  endpointPath: '/v1/chat/completions',
  authType: AUTH_TYPE.BEARER,
  authHeaderName: 'Authorization',
  authPrefix: 'Bearer ',
  modelId: 'gpt-4o-mini',
  modelList: ['gpt-4o-mini', 'gpt-4.1-mini', 'gpt-4.1'],
  extraHeaders: [],
  azureApiVersion: '',
  azureDeploymentID: '',
})

const serverName = ref(PROVIDER_ID.OPENAI)
const modelInput = ref('')
const isAzure = computed(() => serverName.value === PROVIDER_ID.AZURE)

const hydrateByProvider = providerId => {
  const registry = PROVIDER_REGISTRY[providerId]
  if (!registry) return

  form.providerId = providerId
  form.authType = registry.authType
  form.authHeaderName = registry.authHeaderName
  form.authPrefix = registry.authPrefix

  if (!isAzure.value) {
    form.baseUrl = form.baseUrl || registry.defaultBaseUrl
    form.endpointPath = form.endpointPath || registry.defaultEndpointPath
  }

  if (!form.modelList?.length) {
    form.modelList = [...registry.models]
  }

  if (!form.modelId) {
    form.modelId = registry.defaultModel
  }
}

onMounted(() => {
  const {providerConfig} = store.config
  if (providerConfig) {
    serverName.value = providerConfig.providerId || PROVIDER_ID.OPENAI
    Object.assign(form, JSON.parse(JSON.stringify(providerConfig)))
    hydrateByProvider(serverName.value)
  } else {
    hydrateByProvider(serverName.value)
  }
})

const isDisableSaveConfig = computed(() => {
  if (!form.apiKey) return true
  if (!form.authHeaderName) return true
  if (!form.modelId) return true

  if (isAzure.value) {
    if (!form.baseUrl) return true
    if (!form.azureApiVersion) return true
    if (!form.azureDeploymentID) return true
  } else {
    if (!form.baseUrl) return true
    if (!form.endpointPath) return true
  }

  return false
})

const {loading, success, error, askAi} = useAskAi()

const onAddModel = () => {
  const modelCode = modelInput.value.trim()
  if (!modelCode) return
  if (!form.modelList.includes(modelCode)) {
    form.modelList.push(modelCode)
  }
  form.modelId = modelCode
  modelInput.value = ''
}

const onRemoveModel = modelCode => {
  form.modelList = form.modelList.filter(v => v !== modelCode)
  if (form.modelId === modelCode) {
    form.modelId = form.modelList[0] || ''
  }
}

const save = async () => {
  // check config change

  // check token
  try {
    const providerId = serverName.value
    const providerRegistry = PROVIDER_REGISTRY[providerId]
    const apiOrigin = providerId === PROVIDER_ID.AZURE ? API_ORIGINS.AZURE : API_ORIGINS.OPENAI
    const nextProviderConfig = {
      ...form,
      providerId,
      protocol: providerRegistry.protocol,
      authType: form.authType || providerRegistry.authType,
      authHeaderName: form.authHeaderName || providerRegistry.authHeaderName,
      authPrefix: form.authPrefix ?? providerRegistry.authPrefix,
      endpointPath: isAzure.value ? '' : form.endpointPath,
      baseUrl: form.baseUrl,
      azureApiVersion: isAzure.value ? form.azureApiVersion : '',
      azureDeploymentID: isAzure.value ? form.azureDeploymentID : '',
    }

    await askAi({
      authKey: form.apiKey,
      command: 'Say hi',
      url: isAzure.value ? null : form.baseUrl,
      apiOrigin,
      providerConfig: nextProviderConfig,
    })

    store.setConfig({
      ...store.config,
      apiOrigin,
      isAuth: true,
      isFinishSetup: true,
      authKey: form.apiKey,
      selfHostUrl: form.baseUrl,
      azureApiVersion: nextProviderConfig.azureApiVersion,
      azureDeploymentID: nextProviderConfig.azureDeploymentID,
      providerConfig: nextProviderConfig,
    })
  } catch (error) {}
}

watch(serverName, (newValue, oldValue) => {
  hydrateByProvider(newValue)
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

.model-settings {
  display: grid;
  row-gap: 8px;
}

.section-title {
  color: var(--color-baseline-text);
  font-weight: 600;
  font-size: 14px;
}

.model-select {
  width: 360px;
  height: 36px;
  padding: 0 8px;
  color: var(--color-baseline-text);
  background: #fff;
  border: 1px solid #dcdee1;
  border-radius: 5px;
}

.model-input-wrap {
  display: grid;
  grid-template-columns: 1fr auto;
  column-gap: 8px;
}

.add-btn {
  width: 72px;
}

.model-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.model-tag {
  padding: 4px 8px;
  color: var(--color-baseline-text);
  background: #f0f2f7;
  border: 1px solid #d6dae5;
  border-radius: 12px;
  cursor: pointer;
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

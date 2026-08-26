import {ref} from 'vue'
import {defineStore} from 'pinia'
import {Storage} from '@plasmohq/storage'

import {
  WEBPILOT_CONFIG_STORAGE_KEY,
  defaultConfig,
  WEBPILOT_OPENAI,
  OPENAI_BASE_URL,
  API_ORIGINS,
  CONFIG_VERSION,
  createDefaultProviderConfig,
  PROVIDER_ID,
  PROVIDER_REGISTRY,
} from '@/config'

function migrateLegacyConfig(rawConfig) {
  const config = {...defaultConfig, ...rawConfig}

  if (config.configVersion >= CONFIG_VERSION && config.providerConfig) {
    return config
  }

  const providerConfig = createDefaultProviderConfig()
  const apiOrigin = config.apiOrigin

  if (apiOrigin === API_ORIGINS.OPENAI) {
    providerConfig.providerId = PROVIDER_ID.OPENAI
    providerConfig.protocol = PROVIDER_REGISTRY[PROVIDER_ID.OPENAI].protocol
    providerConfig.apiKey = config.authKey || ''
    providerConfig.baseUrl = config.selfHostUrl || OPENAI_BASE_URL
    providerConfig.endpointPath = '/v1/chat/completions'
    providerConfig.modelId = config?.model?.model || PROVIDER_REGISTRY[PROVIDER_ID.OPENAI].defaultModel
    providerConfig.modelList = [...PROVIDER_REGISTRY[PROVIDER_ID.OPENAI].models]
  } else if (apiOrigin === API_ORIGINS.OPENAI_PROXY) {
    providerConfig.providerId = PROVIDER_ID.ZAI
    providerConfig.protocol = PROVIDER_REGISTRY[PROVIDER_ID.ZAI].protocol
    providerConfig.apiKey = config.authKey || ''
    providerConfig.baseUrl = config.selfHostUrl || ''
    providerConfig.endpointPath = '/v1/chat/completions'
    providerConfig.modelId = config?.model?.model || ''
    providerConfig.modelList = []
  } else if (apiOrigin === API_ORIGINS.AZURE) {
    providerConfig.providerId = PROVIDER_ID.AZURE
    providerConfig.protocol = PROVIDER_REGISTRY[PROVIDER_ID.AZURE].protocol
    providerConfig.apiKey = config.authKey || ''
    providerConfig.baseUrl = config.selfHostUrl || ''
    providerConfig.modelId = config?.model?.model || PROVIDER_REGISTRY[PROVIDER_ID.AZURE].defaultModel
    providerConfig.modelList = [...PROVIDER_REGISTRY[PROVIDER_ID.AZURE].models]
    providerConfig.azureApiVersion = config.azureApiVersion || ''
    providerConfig.azureDeploymentID = config.azureDeploymentID || ''
  }

  return {
    ...config,
    configVersion: CONFIG_VERSION,
    providerConfig,
  }
}

const useStore = defineStore('store', () => {
  const storage = new Storage()
  const config = ref(JSON.parse(JSON.stringify(defaultConfig)))

  // selected text
  const selectedText = ref('')

  const setSelectedText = text => {
    selectedText.value = text
  }

  async function initConfig() {
    const storedConfig = await storage.get(WEBPILOT_CONFIG_STORAGE_KEY)
    if (storedConfig && typeof storedConfig === 'object') {
      config.value = migrateLegacyConfig(storedConfig)

      // For old users who have saved some old data, perform some data correction
      if (config.value.apiOrigin === undefined) {
        config.value.apiOrigin = 'personal'
      }
      if (config.value.selfHostUrl === WEBPILOT_OPENAI.HOST_URL) {
        config.value.selfHostUrl = ''
      }
      if (
        !config.value.latestAskedQuestionPromptIndex &&
        !config.value.latestTextSelectionPromptIndex &&
        !config.value.AskedQuestionPrompts &&
        !config.value.TextSelectionPrompts
      ) {
        config.value.latestAskedQuestionPromptIndex = defaultConfig.latestAskedQuestionPromptIndex
        config.value.latestTextSelectionPromptIndex = defaultConfig.latestTextSelectionPromptIndex
        config.value.AskedQuestionPrompts = defaultConfig.AskedQuestionPrompts
        config.value.TextSelectionPrompts = defaultConfig.TextSelectionPrompts
      }

      saveToLocalStorage(config.value)
    }
  }

  function saveToLocalStorage(config) {
    storage.set(WEBPILOT_CONFIG_STORAGE_KEY, config)
  }

  // The current setConfig method requires each tab to be reloaded for the updates in options to take effect
  // Gradually replace setConfig and setPrompts methods with updateConfig, to fetch the latest LocalStorage each time
  async function updateConfig(newConfig) {
    const storedConfig = (await storage.get(WEBPILOT_CONFIG_STORAGE_KEY)) || config.value
    config.value = {...storedConfig, ...newConfig}
    saveToLocalStorage(config.value)
  }

  function setConfig(newConfig) {
    config.value = newConfig
    saveToLocalStorage(config.value)
  }
  function setPrompts(type, prompts) {
    if (!type) return
    config.value = {
      ...config.value,
      [type]: prompts,
    }
    saveToLocalStorage(config.value)
  }

  return {
    config,
    selectedText,
    initConfig,
    setSelectedText,
    updateConfig,
    setPrompts,
    setConfig,
  }
})

export default useStore

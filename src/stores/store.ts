import {ref} from 'vue'
import {defineStore} from 'pinia'
import {Storage} from '@plasmohq/storage'

import {WEBPILOT_CONFIG_STORAGE_KEY, defaultConfig, WEBPILOT_OPENAI} from '@/config'

const useStore = defineStore('store', () => {
  const storage = new Storage()
  const config = ref(defaultConfig)

  // selected text
  const selectedText = ref('')

  const setSelectedText = text => {
    selectedText.value = text
  }

  async function initConfig() {
    const storedConfig = await storage.get(WEBPILOT_CONFIG_STORAGE_KEY)
    if (storedConfig && typeof storedConfig === 'object') {
      config.value = storedConfig

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
        saveToLocalStorage(config.value)
      }
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

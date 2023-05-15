import {defineStore} from 'pinia'
import {ref} from 'vue'
import {Storage} from '@plasmohq/storage'

import {WEBPILOT_CONFIG_STORAGE_KEY, defaultConfig} from '@/config'

const useConfigStore = defineStore('config', () => {
  const storage = new Storage()

  const config = ref(defaultConfig)

  async function initConfig() {
    const storedConfig = await storage.get(WEBPILOT_CONFIG_STORAGE_KEY)
    if (storedConfig && typeof storedConfig === 'object') {
      config.value = storedConfig
    }
  }

  // initConfig() // call initconfig when init store

  function saveToLocalStorage(config) {
    storage.set(WEBPILOT_CONFIG_STORAGE_KEY, config)
  }

  function setConfig(newConfig) {
    console.log('CONFIG:', JSON.stringify(newConfig))
    config.value = newConfig
    saveToLocalStorage(config.value)
  }

  function updatePrompt(index, prompt) {
    const {prompts} = config.value
    prompts[index] = prompt
    saveToLocalStorage(config.value)
  }

  function deletePrompt(index) {
    const {prompts} = config.value
    prompts.splice(index, 1)
    saveToLocalStorage(config.value)
  }

  function addPrompt(prompt) {
    const {prompts} = config.value
    prompts.push(prompt)
    saveToLocalStorage(config.value)
  }

  function setLatestPromptIndex(index) {
    config.value.latestPresetPromptIndex = index
    saveToLocalStorage(config.value)
  }

  function setShowShortcutTips(value) {
    config.value.showShortcutTips = value
    saveToLocalStorage(config.value)
  }

  function ___debuResetConfig() {
    config.value = defaultConfig
    saveToLocalStorage(defaultConfig)
  }

  return {
    config,
    ___debuResetConfig,
    /** Init value before anything elase */
    initConfig,
    setConfig,
    updatePrompt,
    deletePrompt,
    addPrompt,
    setShowShortcutTips,
    setLatestPromptIndex,
  }
})

export default useConfigStore

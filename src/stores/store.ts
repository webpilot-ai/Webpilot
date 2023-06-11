import {ref} from 'vue'
import {defineStore} from 'pinia'
import {Storage} from '@plasmohq/storage'

import {WEBPILOT_CONFIG_STORAGE_KEY, defaultConfig} from '@/config'

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
      // config.value = storedConfig
    }
    console.log('store config:: ', storedConfig)
  }

  function saveToLocalStorage(config) {
    storage.set(WEBPILOT_CONFIG_STORAGE_KEY, config)
  }

  function setConfig(newConfig) {
    config.value = newConfig
    saveToLocalStorage(config.value)
  }

  function setPrompts(prompts) {
    config.value = {
      ...config.value,
      prompts,
    }
    saveToLocalStorage(config.value)
  }

  return {
    config,
    selectedText,
    initConfig,
    setSelectedText,
    setPrompts,
    setConfig,
  }
})

export default useStore

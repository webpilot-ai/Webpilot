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

      // 对于保存了 key 的老用户，进行部分数据修正
      if (config.value.apiOrigin === undefined) {
        config.value.apiOrigin = 'personal'
      }
      if (config.value.selfHostUrl === WEBPILOT_OPENAI.HOST_URL) {
        config.value.selfHostUrl = ''
      }
    }
  }

  function saveToLocalStorage(config) {
    storage.set(WEBPILOT_CONFIG_STORAGE_KEY, config)
  }

  function setConfig(newConfig) {
    config.value = newConfig
    saveToLocalStorage(config.value)
  }

  // 现在的 setConfig，更新 options 后，每个 tab 需要 reload 才生效
  // 逐步替换为 updateConfig，获取最新的 localsorage
  async function updateConfig(newConfig) {
    const storedConfig = (await storage.get(WEBPILOT_CONFIG_STORAGE_KEY)) || config.value
    config.value = {...storedConfig, ...newConfig}
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
    updateConfig,
  }
})

export default useStore

import {defineStore} from 'pinia'
import {ref, toRaw} from 'vue'

import {askOpenAI, parseStream} from '@/io'

import useConfigStore from './config'

const useStore = defineStore('store', () => {
  // selected text
  const selectedText = ref('')
  // ai response text
  const result = ref('')
  // loading state
  const loading = ref(false)

  const configStore = useConfigStore()

  const setSelectedText = text => {
    selectedText.value = text
  }

  const askAi = async ({command}) => {
    // clean
    result.value = ''

    // process config
    const trimedText = selectedText.value.trim()
    const prompt = trimedText === '' ? command : `${command}:\n\n${trimedText}\n\n`

    loading.value = true
    askOpenAI({
      authKey: configStore.config.authKey,
      model: toRaw(configStore.config.model),
      prompt,
    })
      .then(streamReader => {
        loading.value = false
        parseStream(streamReader, reqResult => {
          result.value = reqResult
        })
      })
      .catch(err => {
        loading.value = false

        if (err instanceof DOMException && /aborted/.test(err.message)) return

        if (err.response && err.response.status === 401) {
          configStore.setConfig({
            ...configStore.config,
            authKey: '',
            isAuth: false,
          })
          // TODO: add toast
        } else {
          let errorMsg = err.message || ''

          if (err?.response?.data?.error?.message) {
            // eslint-disable-next-line
            errorMsg = `OpenAI: ${err.response.data.error.message}`
            // TODO: add toast
          }
        }

        throw err
      })
  }

  const cleanResult = () => {
    result.value = ''
  }

  return {
    result,
    loading,
    selectedText,
    askAi,
    cleanResult,
    setSelectedText,
  }
})

export default useStore

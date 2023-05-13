import {defineStore} from 'pinia'
import {ref, toRaw} from 'vue'

import {askOpenAI, parseStream} from '@/io'

import useConfigStore from './config'

const getSelectPropmtTemplate = (text, command) => {
  return [
    {role: 'user', content: text},
    {
      role: 'system',
      content:
        "The user has selected these texts on the webpage. You need to further process these texts based on the user's requirements, or engage in related question and answer activities.",
    },
    {
      role: 'system',
      content:
        'Please try to use the language used in the following content as much as possible in your response.',
    },
    {role: 'user', content: command},
  ]
}

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

  const askAi = async ({referenceText = '', command}) => {
    // clean
    result.value = ''

    let text = referenceText === '' ? selectedText.value : referenceText
    text = text.trim()
    const message = getSelectPropmtTemplate(text, command)

    loading.value = true
    askOpenAI({
      authKey: '',
      model: toRaw(configStore.config.model),
      message,
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

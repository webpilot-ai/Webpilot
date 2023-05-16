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

export const REQUEST_STATE = {
  SUCCESS: 'SUCCESS',
  LOADING: 'LOADING',
  ERROR: 'ERROR',
}

const useStore = defineStore('store', () => {
  // selected text
  const selectedText = ref('')
  // ai response text
  const result = ref('')
  // loading state
  const loading = ref(false)

  const requestState = ref(null)

  const configStore = useConfigStore()

  const setSelectedText = text => {
    selectedText.value = text
  }

  const askAi = async ({referenceText = '', command, authKey = '', url = null}) => {
    result.value = ''

    let text = referenceText === '' ? selectedText.value : referenceText
    text = text.trim()
    const message = getSelectPropmtTemplate(text, command)

    loading.value = true
    requestState.value = REQUEST_STATE.LOADING

    return askOpenAI({
      authKey: authKey === '' ? configStore.config.authKey : authKey,
      model: toRaw(configStore.config.model),
      message,
      url,
    })
      .then(streamReader => {
        loading.value = false
        requestState.value = REQUEST_STATE.SUCCESS
        parseStream(streamReader, reqResult => {
          result.value = reqResult
        })
      })
      .catch(err => {
        loading.value = false
        requestState.value = REQUEST_STATE.ERROR

        if (err instanceof DOMException && /aborted/.test(err.message)) return

        if (err.response && err.response.status === 401) {
          configStore.setConfig({
            ...configStore.config,
            authKey: '',
            isAuth: false,
          })

          throw err
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
    requestState,
    askAi,
    cleanResult,
    setSelectedText,
  }
})

export default useStore

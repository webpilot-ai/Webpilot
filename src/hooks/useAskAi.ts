import {ref, toRaw} from 'vue'

import useStore from '@/stores/store'
import {askOpenAI, parseStream} from '@/io'

const getPropmtTemplate = (text, command) => {
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

export default function useAskAi() {
  const loading = ref(false)
  const success = ref(false)
  const error = ref(false)
  const result = ref('')
  const errorMessage = ref('')

  const store = useStore()

  const resetState = () => {
    loading.value = false
    success.value = false
    error.value = false
    result.value = ''
  }

  const askAi = async ({referenceText = '', command, authKey = '', url = null}) => {
    // clean result
    resetState()

    let text = referenceText === '' ? store.selectedText : referenceText
    text = text.trim()
    const message = getPropmtTemplate(text, command)

    loading.value = true

    return askOpenAI({
      authKey: authKey === '' ? store.config.authKey : authKey,
      model: toRaw(store.config.model),
      message,
      url: url === null || url === undefined ? store.config.selfHostUrl : url,
    })
      .then(streamReader => {
        loading.value = false
        success.value = true
        parseStream(streamReader, reqResult => {
          result.value = reqResult
        })
      })
      .catch(err => {
        loading.value = false
        error.value = true

        if (err instanceof DOMException && /aborted/.test(err.message)) return

        if (err.response && err.response.status === 401) {
          errorMessage.value = err.response?.data?.error?.message

          store.setConfig({
            ...store.config,
            authKey: '',
            isAuth: false,
          })

          throw err
        } else {
          let errorMsg = err.message || ''

          errorMessage.value = `OpenAI: ${errorMsg}`

          if (err?.response?.data?.error?.message) {
            // eslint-disable-next-line
            errorMsg = `OpenAI: ${err.response.data.error.message}`
            // TODO: add toast
          }
        }

        throw err
      })
  }

  return {
    result,
    loading,
    success,
    error,
    errorMessage,
    askAi,
  }
}

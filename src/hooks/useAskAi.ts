import {ref, toRaw} from 'vue'

import useStore from '@/stores/store'
import {askOpenAI, parseStream} from '@/io'

const getPropmtTemplate = (referenceText, command) => {
  return [
    {
      role: 'system',
      content:
        "You are WebPilot, an advanced AI provided by WebPilot.AI. Please follow the user's instructions carefully.",
    },
    {role: 'user', content: referenceText},
    {role: 'user', content: command},
  ]
}

export default function useAskAi() {
  const loading = ref(false)
  const generating = ref(false)
  const success = ref(false)
  const done = ref(false)
  const error = ref(false)
  const result = ref('')
  const errorMessage = ref('')

  const store = useStore()

  const resetState = () => {
    loading.value = false
    generating.value = false
    success.value = false
    done.value = false
    error.value = false
    result.value = ''
    errorMessage.value = ''
  }

  const askAi = async ({referenceText = '', command, authKey = '', url = null} = {}) => {
    // clean result
    resetState()

    if (!referenceText && !command) return askOpenAI()

    let text = referenceText === '' ? store.selectedText : referenceText
    text = text.trim()
    const message = getPropmtTemplate(text, command)

    loading.value = true
    generating.value = true

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
          result.value = reqResult.text
          done.value = reqResult.done
          if (done.value) {
            generating.value = false
          }
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
    generating,
    done,
    success,
    error,
    errorMessage,
    askAi,
  }
}

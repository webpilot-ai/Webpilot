import {ref, toRaw} from 'vue'

import useStore from '@/stores/store'
import {WEBPILOT_OPENAI} from '@/config'
import {askOpenAI, parseStream} from '@/io'

import {$gettext} from '@/utils/i18n'

const getPrompt = (referenceText, command) => {
  return [
    {
      role: 'assistant',
      content: referenceText,
    },
    {
      role: 'user',
      content: command,
    },
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

  const askAi = async ({
    referenceText = '',
    command,
    authKey = '',
    url = null,
    isAskPage = false,
  } = {}) => {
    // clean result
    resetState()

    if (!referenceText && !command) return askOpenAI()

    let text = referenceText === '' ? store.selectedText : referenceText
    text = text.trim()
    const message = getPrompt(text, command)

    loading.value = true
    generating.value = true

    const model = {
      ...toRaw(store.config.model),
    }
    if (isAskPage) {
      // 全局 popup，默认使用 16k 接口
      model.model = 'gpt-3.5-turbo-16k'
    }

    let storeAuthKey = store.config.authKey
    let storeHostUrl = store.config.selfHostUrl

    if (store.config.apiOrigin === 'general') {
      storeAuthKey = WEBPILOT_OPENAI.AUTH_KEY
      storeHostUrl = WEBPILOT_OPENAI.HOST_URL
    }

    return askOpenAI({
      authKey: authKey || storeAuthKey,
      model,
      message,
      baseURL: url || storeHostUrl,
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
        } else if (err.response && err.response.status === 402) {
          errorMessage.value = $gettext(
            'Free usage for this week has been exhausted (50 times/week). You can input your OpenAI API Key in the settings page for unlimited use, or wait for the quota refresh at 0:00 UTC+0 on Monday.'
          )

          throw err
        } else {
          let errorMsg = err.message || ''

          if (err?.response?.data?.error?.message) {
            // eslint-disable-next-line
            errorMsg = `OpenAI: ${err.response.data.error.message}`
            // TODO: add toast
          }

          errorMessage.value = `OpenAI: ${errorMsg}`
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

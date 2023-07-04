import {ref, toRaw} from 'vue'
import {Storage} from '@plasmohq/storage'
import pangu from 'pangu'

import useStore from '@/stores/store'
import {WEBPILOT_OPENAI, WEBPILOT_CONFIG_STORAGE_KEY} from '@/config'
import {askOpenAI, parseStream} from '@/io'

import {$gettext} from '@/utils/i18n'

const getPrompt = (referenceText, command, isAskPage = true) => {
  if (isAskPage) {
    return [
      {
        role: 'assistant',
        content: `This is a webpage contains content and metadata, which can be identified by the markers "Content:" and "Meta:". The metadata adheres to The Open Graph protocol guidelines.

        Content: ${referenceText.content}
        Meta: ${JSON.stringify(referenceText.meta)}`,
      },
      {
        role: 'user',
        content: command,
      },
    ]
  }
  return [
    {
      role: 'assistant',
      content: `For your next input, I will do without any explanation: ${command}`,
    },
    {
      role: 'user',
      content: referenceText.trim(),
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
  const storage = new Storage()

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

    const text = referenceText || store.selectedText
    const message = getPrompt(text, command, isAskPage)

    const currentConfig = (await storage.get(WEBPILOT_CONFIG_STORAGE_KEY)) || store.config

    loading.value = true
    generating.value = true

    const model = {
      ...toRaw(currentConfig.model),
    }
    if (isAskPage) {
      // 全局 popup，默认使用 16k 接口
      model.model = 'gpt-3.5-turbo-16k'
    }

    let storeAuthKey = currentConfig.authKey
    let storeHostUrl = currentConfig.selfHostUrl

    if (currentConfig.apiOrigin === 'general') {
      storeAuthKey = WEBPILOT_OPENAI.AUTH_KEY
      storeHostUrl = WEBPILOT_OPENAI.HOST_URL
    } else {
      if (storeHostUrl === WEBPILOT_OPENAI.HOST_URL) {
        storeHostUrl = ''
      }
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
          result.value = pangu.spacing(reqResult.text)
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

          if (currentConfig.apiOrigin !== 'general') {
            store.setConfig({
              ...currentConfig,
              authKey: '',
              selfHostUrl: '',
              isAuth: false,
            })
          }

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

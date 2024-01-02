import {ref, toRaw} from 'vue'
import {Storage} from '@plasmohq/storage'
import pangu from 'pangu'

import useStore from '@/stores/store'
import {WEBPILOT_OPENAI, WEBPILOT_CONFIG_STORAGE_KEY, API_ORIGINS} from '@/config'
import {askOpenAI, parseStream} from '@/io'

import {$gettext} from '@/utils/i18n'

const getPrompt = (referenceText, command, isAskPage, previousCommand, previousAnswer, capture) => {
  const foundResult = !!previousAnswer && previousAnswer !== ''
  let information
  if (capture?.length > 0) {
    // vision mode
    information = [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: command,
          },
          {
            type: 'image_url',
            image_url: {
              url: capture,
            },
          },
        ],
      },
    ]
  } else if (!isAskPage && foundResult) {
    // select mode
    information = [
      {
        role: 'assistant',
        content: `For your next input, I will do without any explanation: ${previousCommand}`,
      },
      {
        role: 'user',
        content: referenceText.trim(),
      },
      {
        role: 'assistant',
        content: previousAnswer,
      },
      {
        role: 'user',
        content: command,
      },
    ]
  } else if (!isAskPage) {
    // select mode in first time
    information = [
      {
        role: 'assistant',
        content: `For your next input, I will do without any explanation: ${command}`,
      },
      {
        role: 'user',
        content: referenceText.trim(),
      },
    ]
  } else if (isAskPage && foundResult) {
    // QA mode
    information = [
      {
        role: 'function',
        name: 'current_webpage',
        content: referenceText,
      },
      {
        role: 'user',
        content: previousCommand,
      },
      {
        role: 'assistant',
        content: previousAnswer,
      },
      {
        role: 'user',
        content: command,
      },
    ]
  } else {
    // QA mode in first time
    information = [
      {
        role: 'function',
        name: 'current_webpage',
        content: referenceText,
      },
      {
        role: 'user',
        content: command,
      },
    ]
  }
  return information
}

export default function useAskAi() {
  const loading = ref(false)
  const generating = ref(false)
  const success = ref(false)
  const done = ref(false)
  const error = ref(false)
  const result = ref('')
  const previousCommand = ref('')
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
    capture = '',
    authKey = '',
    url = null,
    isAskPage = true,
    apiOrigin = null,
  } = {}) => {
    const previousAnswer = result.value

    // clean result
    resetState()

    if (!referenceText && !command) return askOpenAI()

    const text = referenceText || store.selectedText
    const message = getPrompt(
      text,
      command,
      isAskPage,
      previousCommand.value,
      previousAnswer,
      capture
    )

    const currentConfig = (await storage.get(WEBPILOT_CONFIG_STORAGE_KEY)) || store.config

    loading.value = true
    generating.value = true

    const model = {
      ...toRaw(currentConfig.model),
    }
    if (capture) {
      model.model = 'gpt-4-vision-preview'
      model.max_tokens = 300
    } else if (isAskPage) {
      // 全局 popup，默认使用 16k 接口`
      model.model = 'gpt-3.5-turbo-1106'
    }

    let storeAuthKey = currentConfig.authKey
    let storeHostUrl = currentConfig.selfHostUrl
    const currentApiOrigin = apiOrigin || currentConfig.apiOrigin

    if (currentApiOrigin === API_ORIGINS.GENERAL) {
      storeAuthKey = WEBPILOT_OPENAI.AUTH_KEY
      storeHostUrl = WEBPILOT_OPENAI.HOST_URL
    } else if (currentApiOrigin === API_ORIGINS.AZURE) {
      const {selfHostUrl, azureApiVersion, azureDeploymentID} = currentConfig

      // https://learn.microsoft.com/en-us/azure/ai-services/openai/reference#completions
      storeHostUrl = `https://${selfHostUrl}.openai.azure.com/openai/deployments/${azureDeploymentID}/chat/completions?api-version=${azureApiVersion}`
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
      apiOrigin: currentApiOrigin,
    })
      .then(streamReader => {
        loading.value = false
        success.value = true
        parseStream(streamReader, reqResult => {
          result.value = pangu.spacing(reqResult.text)
          done.value = reqResult.done
          previousCommand.value = command
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

          if (currentApiOrigin !== 'general') {
            store.setConfig({
              ...currentConfig,
              authKey: '',
              selfHostUrl: '',
              isAuth: false,
            })
          } else {
            store.setConfig({
              ...currentConfig,
              authKey: '',
              selfHostUrl: '',
              isAuth: false,
              azureApiVersion: '',
              azureDeploymentID: '',
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

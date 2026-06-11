import {Storage} from '@plasmohq/storage'

import {getEncoding} from 'js-tiktoken'

import {
  OPENAI_BASE_URL,
  API_PATH,
  WEBPILOT_OPENAI,
  API_ORIGINS,
  PROVIDER_PROTOCOL,
  AUTH_TYPE,
} from '@/config'
import {GOOGLE_CREDENTIAL} from '@/apiConfig'

// function getTokensNum(messages) {
//   const encoding = getEncoding('cl100k_base')
//   let num = 0
//   messages.forEach(message => {
//     num += 4
//     for (const [key, value] of Object.entries(message)) {
//       num += encoding.encode(value).length
//       if (key === 'name') {
//         num -= 1
//       }
//     }
//   })
//   num += 2

//   return num
// }

// refrence to https://platform.openai.com/docs/guides/gpt/managing-tokens
function getNewCutMessages(messages) {
  const encoding = getEncoding('cl100k_base')
  // 16k * 3/4
  const maxRequestTokens = 3200
  const newMessages = [{...messages[0], content: ''}, {...messages[1]}]
  let remainNum = maxRequestTokens - 2

  newMessages.forEach(message => {
    remainNum -= 4
    for (const [value] of Object.entries(message)) {
      remainNum -= encoding.encode(value).length
    }
  })

  if (remainNum < 0) {
    remainNum = 0
  }

  const {content} = messages[0]
  const contentToken = encoding.encode(content, 'all')
  const newContentToken = contentToken.slice(0, remainNum)
  const newContent = encoding.decode(newContentToken)
  newMessages[0].content = newContent

  if (messages[2]) newMessages.push({...messages[2]})
  if (messages[3]) newMessages.push({...messages[3]})

  return newMessages
}

let prevAbortController = null

function normalizeUrl(baseUrl, endpointPath) {
  const safeBase = (baseUrl || '').replace(/\/+$/, '')
  const safePath = endpointPath
    ? endpointPath.startsWith('/')
      ? endpointPath
      : `/${endpointPath}`
    : ''
  return `${safeBase}${safePath}`
}

function buildHeaders(providerConfig, key) {
  const headers = {
    'Content-Type': 'application/json',
  }

  const authType = providerConfig?.authType || AUTH_TYPE.BEARER
  const authHeaderName = providerConfig?.authHeaderName || 'Authorization'
  const authPrefix = providerConfig?.authPrefix || ''

  if (authType === AUTH_TYPE.BEARER) {
    headers[authHeaderName] = `${authPrefix || 'Bearer '}${key}`
  } else if (authType === AUTH_TYPE.API_KEY || authType === AUTH_TYPE.CUSTOM_HEADER) {
    headers[authHeaderName] = `${authPrefix}${key}`
  }

  if (Array.isArray(providerConfig?.extraHeaders)) {
    providerConfig.extraHeaders.forEach(item => {
      if (item?.key) {
        headers[item.key] = item.value || ''
      }
    })
  }

  if (providerConfig?.protocol === PROVIDER_PROTOCOL.ANTHROPIC_MESSAGES) {
    headers['anthropic-version'] = '2023-06-01'
  }

  return headers
}

function buildRequestBody(providerConfig, model, message) {
  const requestModel = {...model}
  requestModel.messages =
    requestModel.model === 'gpt-4o-mini' ? getNewCutMessages(message) : message
  requestModel.stream = true

  if (providerConfig?.protocol === PROVIDER_PROTOCOL.ANTHROPIC_MESSAGES) {
    const userText = message.map(item => `${item.role}: ${item.content}`).join('\n\n')

    return {
      model: providerConfig.modelId || requestModel.model,
      stream: true,
      max_tokens: 2048,
      messages: [{role: 'user', content: userText}],
    }
  }

  return requestModel
}

function resolveRequestUrl({baseURL, apiOrigin, providerConfig}) {
  if (!providerConfig) {
    let prefixURL = baseURL || OPENAI_BASE_URL

    if (prefixURL.endsWith('/')) {
      prefixURL = prefixURL.substring(0, prefixURL.length - 1)
    }

    return apiOrigin === API_ORIGINS.AZURE ? prefixURL : `${prefixURL}${API_PATH}`
  }

  if (providerConfig.protocol === PROVIDER_PROTOCOL.AZURE_OPENAI) {
    const host = providerConfig.baseUrl
    const deployment = providerConfig.azureDeploymentID
    const version = providerConfig.azureApiVersion
    return `https://${host}.openai.azure.com/openai/deployments/${deployment}/chat/completions?api-version=${version}`
  }

  return normalizeUrl(providerConfig.baseUrl, providerConfig.endpointPath)
}

export async function askOpenAI({
  authKey,
  model,
  message,
  baseURL = null,
  apiOrigin,
  providerConfig = null,
} = {}) {
  // abort control
  const abortController = new AbortController()

  if (prevAbortController) prevAbortController.abort()
  prevAbortController = abortController

  if (!model) return Promise.resolve()

  const requestBody = buildRequestBody(providerConfig, model, message)
  const url = resolveRequestUrl({baseURL, apiOrigin, providerConfig})

  const storage = new Storage()
  const webpilotKey = await storage.get(GOOGLE_CREDENTIAL)

  const key = authKey === WEBPILOT_OPENAI.AUTH_KEY ? webpilotKey : authKey

  // const error = new Error()
  // error.response = {status: 402}
  // throw error
  // return

  const headers = providerConfig
    ? buildHeaders(providerConfig, key)
    : apiOrigin === API_ORIGINS.AZURE
      ? {
          'Content-Type': 'application/json',
          'api-key': key,
        }
      : {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${key}`,
        }

  return fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(requestBody),
    signal: abortController.signal,
  }).then(async response => {
    const streamReader = response.body.getReader()
    streamReader.abortController = abortController

    if (!response.ok) {
      const decoder = new TextDecoder()
      const {value} = await streamReader.read()
      const text = decoder.decode(value, {stream: true})

      try {
        response.data = JSON.parse(text)
      } catch (e) {}

      // eslint-disable-next-line prefer-promise-reject-errors
      return Promise.reject({response})
    }

    return streamReader
  })
}

export async function parseStream(streamReader, onUpdate) {
  const decoder = new TextDecoder()
  let text = ''

  const parseChunk = payload => {
    if (payload?.choices?.[0]?.delta?.content) {
      return payload.choices[0].delta.content
    }

    if (payload?.delta?.text) {
      return payload.delta.text
    }

    return ''
  }

  while (true) {
    let done = false
    let value = ''
    try {
      // eslint-disable-next-line
      const stream = await streamReader.read()
      done = stream.done
      value = stream.value
    } catch (e) {
      return onUpdate({done, text})
    }

    if (done) return onUpdate({done, text})

    const chunk = decoder.decode(value, {stream: true})
    const dataStrList = chunk
      .split('\n')
      .map(line => line.trim())
      .filter(line => line !== '' && line !== '[DONE]')

    // eslint-disable-next-line
    dataStrList.forEach(dataStr => {
      const dataJson = dataStr.replace(/^data:/, '').trim()
      try {
        const data = JSON.parse(dataJson)
        const content = parseChunk(data)
        if (!content) return

        text += content

        onUpdate({done, text})
      } catch (e) {}
    })
  }
}

import {Storage} from '@plasmohq/storage'

import {getEncoding} from 'js-tiktoken'

import {OPENAI_BASE_URL, API_PATH, WEBPILOT_OPENAI, API_ORIGINS} from '@/config'
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
  const maxRequstTokens = 12288
  const newMessages = [{...messages[0], content: ''}, {...messages[1]}]
  let remainNum = maxRequstTokens - 2

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

  return newMessages
}

let prevAbortController = null

export async function askOpenAI({authKey, model, message, baseURL = null, apiOrigin} = {}) {
  // abort control
  const abortController = new AbortController()

  if (prevAbortController) prevAbortController.abort()
  prevAbortController = abortController

  if (!model) return Promise.resolve()

  // Reassemble model and process long content request
  const requestModel = {...model}
  requestModel.messages =
    requestModel.model === 'gpt-3.5-turbo-16k' ? getNewCutMessages(message) : message
  requestModel.stream = true

  // Assemble url
  let prefixURL = baseURL || OPENAI_BASE_URL

  if (prefixURL.endsWith('/')) {
    prefixURL = prefixURL.substring(0, prefixURL.length - 1)
  }
  const url = apiOrigin === API_ORIGINS.AZURE ? prefixURL : `${prefixURL}${API_PATH}`

  const storage = new Storage()
  const webpilotKey = await storage.get(GOOGLE_CREDENTIAL)

  const key = authKey === WEBPILOT_OPENAI.AUTH_KEY ? webpilotKey : authKey

  // const error = new Error()
  // error.response = {status: 402}
  // throw error
  // return

  const headers =
    apiOrigin === API_ORIGINS.AZURE
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
    body: JSON.stringify(requestModel),
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
    const dataStrList = chunk.split('\n\n')

    // eslint-disable-next-line
    dataStrList.forEach(dataStr => {
      const dataJson = dataStr.replace(/^data:/, '').trim()
      try {
        const data = JSON.parse(dataJson)
        const content = data?.choices[0]?.delta?.content
        if (!content) return

        text += content

        onUpdate({done, text})
      } catch (e) {}
    })
  }
}

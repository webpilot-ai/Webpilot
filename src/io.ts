import {OPEN_AI_API} from '@/config'

let prevAbortController = null

export function askOpenAI({authKey, model, message, url = null} = {}) {
  const abortController = new AbortController()

  if (prevAbortController) prevAbortController.abort()
  prevAbortController = abortController

  if (!model) return Promise.resolve()

  const requestModel = model
  requestModel.messages = message
  requestModel.stream = true

  return fetch(url || OPEN_AI_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authKey}`,
    },
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

import {OPEN_AI_API} from '@/config'

export async function askOpenAI({authKey, model, prompt}) {
  model.messages = [{role: 'user', content: prompt}]
  model.stream = true

  return fetch(OPEN_AI_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authKey}`,
    },
    body: JSON.stringify(model),
  }).then(async response => {
    const streamReader = response.body.getReader()

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

export async function parseStream(streamReader, onUpdate = () => null) {
  const decoder = new TextDecoder()
  let text = ''

  while (true) {
    const {done, value} = await streamReader.read()

    if (done) return text

    const chunk = decoder.decode(value, {stream: true})
    const dataStrList = chunk.split('\n\n')

    dataStrList.forEach(dataStr => {
      const dataJson = dataStr.replace(/^data:/, '').trim()
      try {
        const data = JSON.parse(dataJson)
        const content = data?.choices[0]?.delta?.content
        if (!content) return

        text += content

        onUpdate(text)
      } catch (e) {}
    })
  }
}

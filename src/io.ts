import axios from 'axios'
import {OPEN_AI_API} from '@/config'

export function askOpenAI({authKey, model, prompt}) {
  model.messages = [{role: 'user', content: prompt}]

  return axios
    .post(OPEN_AI_API, model, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authKey}`,
      },
    })
    .then(({data}) => {
      if (!(data && data.choices && data.choices.length)) {
        throw new Error('OpenAI API response does not contain any choices.')
      }

      const result = data.choices[0].message.content
      return result.replace(/^\n+/, '')
    })
}

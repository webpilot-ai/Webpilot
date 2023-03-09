import {useEffect, useState} from 'react'
import {createRoot} from 'react-dom/client'

import {askOpenAI} from '@/io'
import useConfig from '@/hooks/use-config'

export const config = {
  matches: ['https://github.com/*/*/issues/*'],
}

export const getRootContainer = () =>
  new Promise(resolve => {
    const $submit = document.querySelector('.js-slash-command-surface button[type=submit]')
    const $parent = $submit.parentNode

    if ($parent && $submit) {
      const $rootContainer = document.createElement('div')
      $parent.insertBefore($rootContainer, $submit)
      resolve($rootContainer)
    }
  })

export default function InjectButton() {
  const [loading, setLoading] = useState(false)

  const {config} = useConfig()
  const {authKey, model} = config

  useEffect(() => {
    const $textarea = getTextarea()
    $textarea.placeholder = 'Write prompt here, click Fluentify, get your content'
  }, [])

  const handelClick = () => {
    const {value} = getTextarea()
    setLoading(true)

    askOpenAI({authKey, model, prompt: value})
      .then(res => {
        const $textarea = getTextarea()
        if (res) {
          $textarea.value += `\n\n`
          $textarea.value += res
        }
      })
      .catch(err => {
        alert(err?.response?.data?.error?.message || err.message)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <div className="btn-primary btn" onClick={handelClick}>
      {loading ? 'loading...' : 'Fluentify'}
    </div>
  )
}

export const render = async ({createRootContainer}) => {
  const rootContainer = await createRootContainer()

  const root = createRoot(rootContainer)
  root.render(<InjectButton />)
}

function getTextarea() {
  const $textarea = document.getElementById('issue_body')
  return $textarea
}

import style from './style.module.scss'

import {useState} from 'react'
import {useNavigate} from 'react-router'

import {defaultConfig, ROUTE} from '@/config'
import {gettext} from '@/utils'

import useConfig from '@/hooks/use-config'
import useAI from '@/hooks/use-ai'

import Button from '@/components/button'

export default function PromptList() {
  const defaultActiveButtonIndex = -1

  const [activeButtonIndex, setActiveButtonIndex] = useState(defaultActiveButtonIndex)

  const {config, setConfig} = useConfig()
  const {ai, askAI} = useAI()
  const navigate = useNavigate()

  const prompts = config.prompts || defaultConfig.prompts

  const askAIByPrompt = (prompt, index) => {
    setActiveButtonIndex(index)
    const {command} = prompt
    askAI({command})
      .catch(err => {
        if (err.response && err.response.status === 401) {
          navigate(ROUTE.POPUP_ENTRY_PANEL, {replace: true})
        }
      })
      .finally(() => setActiveButtonIndex(defaultActiveButtonIndex))
  }

  const navToCustomPanel = () => {
    const route = ROUTE.POPUP_CUSTOM_PANEL

    navigate(route, {replace: true})
    setConfig({...config, latestRoute: route})
  }

  return (
    <section className={style.promptList}>
      {prompts.map((prompt, index) => (
        <div key={index} className={style.item}>
          <Button
            text={prompt.title}
            tooltip={prompt.command}
            disabled={ai.loading}
            loading={index === activeButtonIndex && ai.loading}
            onClick={() => askAIByPrompt(prompt, index)}
          />
        </div>
      ))}
      <div className={style.item}>
        <Button disabled={ai.loading} onClick={navToCustomPanel}>
          <div className={style.custom}>{gettext('Other')}</div>
        </Button>
      </div>
    </section>
  )
}

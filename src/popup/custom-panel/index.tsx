import style from './style.module.scss'

import {useEffect, useState} from 'react'
import {useNavigate} from 'react-router'

import {ROUTE} from '@/config'
import {gettext} from '@/utils'

import useAI from '@/hooks/use-ai'
import useConfig from '@/hooks/use-config'

import Header from '../../components/popup-header'
import ConfirmInput from '@/components/confirm-input'
import PromptResult from '@/components/prompt-result'

export default function CustomPanel() {
  const {config, setConfig} = useConfig()
  const {ai, askAI} = useAI()
  const navigate = useNavigate()

  const [command, setCommand] = useState(config.customCommand || '')

  useEffect(() => {
    setCommand(config.customCommand)
  }, [config.customCommand])

  const askAIByPrompt = () => {
    setConfig({...config, customCommand: command})
    askAI({command}).catch(err => {
      if (err.response && err.response.status === 401) {
        navigate(ROUTE.POPUP_ENTRY_PANEL, {replace: true})
      }
    })
  }

  const handleChangeInput = e => {
    const {value} = e.target
    setCommand(value)
  }

  const navToPresetPanel = () => {
    const route = ROUTE.POPUP_PRESET_PANEL

    navigate(route, {replace: true})
    setConfig({...config, latestRoute: route})
  }

  return (
    <section className={style.customPanel}>
      <Header back={navToPresetPanel} />

      <section className={style.command}>
        <div className={style.tips}>
          {gettext('What do you want to do with the selected text?')}
        </div>
        <ConfirmInput
          value={command}
          loading={ai.loading}
          disabled={!command.trim().length}
          handleChangeInput={handleChangeInput}
          onConfirm={askAIByPrompt}
          placeholder={gettext('e.g. summarize text, be concise')}
        />
      </section>

      <PromptResult
        placeholder={
          gettext(`Instructions\n1. Select some text on a webpage\n`) +
          gettext(`2. Enter a command in the input box above and click the Confirm button`)
        }
      />
    </section>
  )
}

import {useEffect, useState} from 'react'
import copyToClipboard from 'copy-to-clipboard'
import css from 'styled-jsx/css'

import {useMessage} from '@plasmohq/messaging/hook'

import {MESSAGING_EVENT, ROUTE} from '@/config'
import {gettext, toast} from '@/utils'

import useAI from '@/hooks/use-ai'
import useConfig from '@/hooks/use-config'

import ConfirmInput from '@/components/confirm-input'
import PromptBoardHeader from '@/components/prompt-board-header'
import PromptBoardResult from '@/components/prompt-board-result'

export default function CustomPanel() {
  const {ai, askAI} = useAI()
  const {config, setConfig} = useConfig()
  const {customCommand} = config

  const [command, setCommand] = useState(customCommand || '')

  useEffect(() => {
    setCommand(config.customCommand)
  }, [config.customCommand])

  useMessage((req, res) => {
    if (req.name === MESSAGING_EVENT.INVOKE_ASK_AI) {
      const {selectedText} = req.body

      askAI({command, text: selectedText}).then(res => {
        if (copyToClipboard(res, {format: 'text/plain'})) {
          toast.success(gettext('Copy succeeded'), {position: 'bottom-center', autoClose: 600})
        }
      })

      res.send(`${MESSAGING_EVENT.INVOKE_ASK_AI}: success`)
    }
  })

  const askAIByPrompt = () => {
    setConfig({...config, customCommand: command})
    askAI({command})
  }

  const handleChangeInput = e => {
    const {value} = e.target
    setCommand(value)
  }

  const navToPresetPanel = () => {
    const route = ROUTE.PROMPT_BOARD_PRESET_PANEL

    setConfig({...config, latestRoute: route})
  }

  return (
    <section className="custom-panel">
      <PromptBoardHeader back={navToPresetPanel} />

      <section className="command">
        <div className="tips">{gettext('What do you want to do with the selected text?')}</div>
        <ConfirmInput
          value={command}
          loading={ai.loading}
          handleChangeInput={handleChangeInput}
          onConfirm={askAIByPrompt}
          placeholder={gettext('e.g. summarize text, be concise')}
        />
      </section>

      <PromptBoardResult
        placeholder={
          gettext(
            `How to use:\n1. Ask a question about selected text on the webpage, or take it as prompt\n\n`
          ) +
          gettext(
            `Auto-Pop Mode:\n1. Click top-right icon to toggle\n2. Pop-up when text selected\n\n`
          ) +
          gettext(
            `Turbo Mode:\n1. Click lightning icon to toggle\n2. Auto process selected text\n3. Auto copy the result`
          )
        }
      />

      <style jsx>{styles}</style>
    </section>
  )
}

const styles = css`
  .custom-panel {
    width: 100%;
  }

  .command {
    margin-top: 20px;
    padding-bottom: 14px;
  }

  .tips {
    height: 40px;
    margin-bottom: 14px;
    color: #7d7d7d;
    font-size: 16px;
    line-height: 40px;
  }
`

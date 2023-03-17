import RadioIcon from 'react:@assets/images/radio.svg'
import RadioCheckedIcon from 'react:@assets/images/radio-checked.svg'

import {useState} from 'react'
import copyToClipboard from 'copy-to-clipboard'
import {useMessage} from '@plasmohq/messaging/hook'
import css from 'styled-jsx/css'

import {defaultConfig, MESSAGING_EVENT, ROUTE} from '@/config'
import {gettext, toast} from '@/utils'

import useConfig from '@/hooks/use-config'
import useAI from '@/hooks/use-ai'

import Button from '@/components/button'

export default function PromptList() {
  const defaultActiveButtonIndex = -1

  const [activeButtonIndex, setActiveButtonIndex] = useState(defaultActiveButtonIndex)

  const {config, setConfig} = useConfig()
  const {ai, askAI} = useAI()

  const {turboMode, latestPresetPromptIndex = 0} = config
  const prompts = config.prompts || defaultConfig.prompts

  useMessage((req, res) => {
    if (req.name === MESSAGING_EVENT.INVOKE_ASK_AI) {
      const {selectedText} = req.body

      const prompt = prompts[latestPresetPromptIndex]
      const {command} = prompt

      setActiveButtonIndex(latestPresetPromptIndex)

      askAI({command, text: selectedText})
        .then(res => {
          if (copyToClipboard(res, {format: 'text/plain'})) {
            toast.success(gettext('Copy succeeded'), {position: 'bottom-center', autoClose: 600})
          }
        })
        .finally(() => setActiveButtonIndex(defaultActiveButtonIndex))

      res.send('success')
    }
  })

  const askAIByPrompt = index => {
    setActiveButtonIndex(index)
    setConfig({...config, latestPresetPromptIndex: index})

    const prompt = prompts[index]
    const {command} = prompt
    askAI({command}).finally(() => setActiveButtonIndex(defaultActiveButtonIndex))
  }

  const navToCustomPanel = () => {
    const route = ROUTE.PROMPT_BOARD_CUSTOM_PANEL

    setConfig({...config, latestRoute: route})
  }

  return (
    <section className="prompt-list">
      {prompts.map((prompt, index) => (
        <div key={index} className="item">
          <Button
            text={prompt.title}
            tooltip={prompt.command}
            disabled={ai.loading}
            loading={index === activeButtonIndex && ai.loading}
            selected={turboMode && index === latestPresetPromptIndex}
            onClick={() => askAIByPrompt(index)}
            Icon={
              turboMode
                ? () => (index === latestPresetPromptIndex ? <RadioCheckedIcon /> : <RadioIcon />)
                : null
            }
          />
        </div>
      ))}

      <div className="item">
        <Button disabled={ai.loading} onClick={navToCustomPanel}>
          <div className="custom">{gettext('Other')}</div>
        </Button>
      </div>

      <style jsx>{styles}</style>
    </section>
  )
}

const styles = css`
  .prompt-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    margin-top: 20px;
  }

  .item {
    width: 45%;
    margin-bottom: 14px;
  }

  .custom {
    width: 100%;
    text-align: left;
  }
`

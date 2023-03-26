import css from 'styled-jsx/css'
import {useEffect, useRef, useState} from 'react'
import {sendToContentScript} from '@plasmohq/messaging'
import {useMessage} from '@plasmohq/messaging/hook'

// import {gettext} from '@/utils'
import {MESSAGING_EVENT} from '@/config'

import PromptBoardHeader from '@/components/prompt-board-header'
import PromptBoardResult from '@/components/prompt-board-result'
import SelectedPreview from '@/components/selected-preview'
import ConfirmInput from '@/components/confirm-input'
import useConfig from '@/hooks/use-config'
import useAI from '@/hooks/use-ai'

import PromptList from './prompt-list'

export default function PresetPanel() {
  const element = useRef<HTMLElement>()
  const [height, setHeight] = useState<number>(0)
  const [prompt, setPrompt] = useState({})
  const [disabled, setDisabled] = useState(false)
  const [selectPromptIndex, setSelectPromptIndex] = useState(-1)
  const [inputPrompt, setInputPrompt] = useState('')
  const [selectedText, setSelectedText] = useState('')

  const {ai, askAI} = useAI()

  const {config} = useConfig()
  const {prompts} = config
  const {latesPresetPromptIndex = 0, turboMode} = config

  const resizeObserver = new ResizeObserver(() => {
    const currentHeight = element.current.clientHeight
    const currentWidth = element.current.clientWidth

    if (currentHeight !== height) {
      setHeight(currentHeight)
      sendToContentScript({
        name: MESSAGING_EVENT.SYNC_FRAME_SIZE,
        body: {
          width: currentWidth,
          height: currentHeight,
        },
      })
    }
  })

  useEffect(() => {
    setPrompt(prompts[latesPresetPromptIndex])

    resizeObserver.observe(element.current)
    return () => {
      resizeObserver.disconnect()
    }
  }, [])

  useMessage<string, string>(req => {
    const {name, body} = req
    if (name === MESSAGING_EVENT.SYNC_SELECTED_TEXT) {
      setSelectedText(body)
      if (turboMode) {
        setSelectPromptIndex(latesPresetPromptIndex)
        setPrompt(config.prompts[latesPresetPromptIndex])
        askAIByPrompt()
      }
    }

    if (name === MESSAGING_EVENT.CLEAN_DATA) {
      cleanData()
    }
  })

  const cleanData = () => {
    setPrompt({})
    setSelectPromptIndex(-1)
    setInputPrompt('')
  }

  const handleUpdatePromptIndex = index => {
    setSelectPromptIndex(index)

    if (inputPrompt) setInputPrompt('')

    setPrompt(prompts[index])
    askAIByPrompt()
  }

  useEffect(() => {
    setDisabled(!inputPrompt || ai.loading || prompt?.command)
  }, [inputPrompt, ai.loading, prompt])

  const askAIByPrompt = () => {
    const command = inputPrompt !== '' ? inputPrompt : prompt?.command
    askAI({command})
  }

  return (
    <section className="preset-panel" ref={element}>
      <PromptBoardHeader />
      <SelectedPreview selectedText={selectedText} />
      <PromptList
        onSelect={e => setPrompt(e)}
        selectIndex={selectPromptIndex}
        updateIndex={handleUpdatePromptIndex}
      />
      <ConfirmInput
        loading={ai.loading}
        disabled={disabled}
        placeholder={prompt?.command}
        command={prompt?.command}
        onConfirm={askAIByPrompt}
      />
      <PromptBoardResult />
      <style jsx>{styles}</style>
      <style jsx>{globalStyles}</style>
    </section>
  )
}

const styles = css`
  .preset-panel {
    width: 450px;
    padding: 12px;
  }
`

const globalStyles = css.global`
  body {
    overflow: hidden;
  }

  .confirm-input {
    margin-top: 8px !important;
  }
`

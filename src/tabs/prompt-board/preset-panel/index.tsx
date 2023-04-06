import css from 'styled-jsx/css'
import {useEffect, useRef, useState} from 'react'
import {useMessage} from '@plasmohq/messaging/hook'
import {sendToContentScript} from '@plasmohq/messaging'

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
  const [prompt, setPrompt] = useState({})
  const [selectPromptIndex, setSelectPromptIndex] = useState(-1)
  const [inputCommand, setInputCommand] = useState('')
  const [selectedText, setSelectedText] = useState('')

  const {ai, askAI} = useAI()

  const {config} = useConfig()
  const {prompts} = config
  const {latesPresetPromptIndex = 0, turboMode} = config

  useEffect(() => {
    const handleKeyUp = e => {
      if (e.key === 'Escape') {
        sendToContentScript({name: MESSAGING_EVENT.CLICK_CLOSE})
      }
    }

    console.log('Add Key')
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      console.log('Remove Key')
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  useMessage<string, string>(req => {
    const {name, body} = req
    if (name === MESSAGING_EVENT.SYNC_SELECTED_TEXT) {
      setSelectedText(body)
      if (turboMode) {
        setSelectPromptIndex(latesPresetPromptIndex)
        const prompt = config.prompts[latesPresetPromptIndex]
        setPrompt(prompt)
        askAIByPrompt(prompt.command, selectedText)
      }
    }

    if (name === MESSAGING_EVENT.CLEAN_DATA) {
      cleanData()
    }

    if (req.name === MESSAGING_EVENT.INPUT_FOCUS) {
      const input = document.getElementById('prompt-input')
      input?.focus()
    }
  })

  const cleanData = () => {
    console.log('Clean Data:')
    setPrompt({})
    setSelectPromptIndex(-1)
    setInputCommand('')
  }

  const handleUpdatePromptIndex = index => {
    setSelectPromptIndex(index)

    if (inputCommand) setInputCommand('')

    const prompt = prompts[index]

    setPrompt(prompt)
    askAIByPrompt(prompt.command, selectedText)
  }

  const handleCommandChange = command => {
    setInputCommand(command)
    setPrompt({
      ...prompt,
      command,
    })
  }

  const handleConfirm = command => {
    askAIByPrompt(command, selectedText)
  }

  useEffect(() => {
    if (!!inputCommand && inputCommand !== '') {
      setSelectPromptIndex(-1)
    }
  }, [inputCommand])

  const askAIByPrompt = (command, text) => {
    askAI({command, text})
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
        disabled={ai.loading}
        placeholder={prompt?.command}
        command={prompt?.command}
        onConfirm={handleConfirm}
        onTextChange={handleCommandChange}
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

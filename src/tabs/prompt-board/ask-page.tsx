import css from 'styled-jsx/css'
import {useState} from 'react'
import {sendToContentScript} from '@plasmohq/messaging'

import {MESSAGING_EVENT} from '@/config'
import PromptBoardHeader from '@/components/prompt-board-header'
import ConfirmInput from '@/components/confirm-input'
import PromptBoardResult from '@/components/prompt-board-result'
import ReferenceBtnGroup, {ReferenceType} from '@/components/reference-btn-group'
import useAI from '@/hooks/use-ai'
import {toast} from '@/utils'

export default function AskPage() {
  const {ai, askAI} = useAI()

  const [command, setCommand] = useState('')
  const [askType, setAskType] = useState(ReferenceType.NONE)

  const handleCommandChange = (text: string) => {
    setCommand(text)
  }

  const handleInputConfirm = (command: string) => {
    askIAByCommand(command, askType)
  }

  const handleTypeChange = (type: ReferenceType) => {
    setAskType(type)
    askIAByCommand(command, type)
  }

  const askIAByCommand = async (command: string, type: ReferenceType) => {
    if (type === ReferenceType.NONE) {
      askAI({
        command,
        onlyCommand: true,
      })
    } else if (type === ReferenceType.THE_SELECT) {
      // leave text empty it will get selected text automatically
      askAI({command})
    } else if (type === ReferenceType.THIS_PAGE) {
      const article = await sendToContentScript({name: MESSAGING_EVENT.GET_DOCUMENT})

      if (article === '' || !article) {
        // FIXME: i18n
        toast.error("Can't get article")
        return
      }

      // FIXME: article maybe too long for ask, need token calculator
      if (command) {
        askAI({command: `${command}:\n\n${article}\n\n`, onlyCommand: true})
      }
    }
  }

  return (
    <section className="ask-page-panel">
      <PromptBoardHeader hideTurboMode />
      <ConfirmInput
        loading={ai.loading}
        onConfirm={handleInputConfirm}
        onTextChange={handleCommandChange}
      />
      <ReferenceBtnGroup
        disabled={ai.loading}
        parentType={askType}
        onTypeChange={handleTypeChange}
      />
      <PromptBoardResult />
      <style jsx>{styles}</style>
      <style jsx>{globalStyle}</style>
    </section>
  )
}

const styles = css`
  .ask-page-panel {
    padding: 16px;
  }
`

const globalStyle = css.global`
  .confirm-input {
    margin-top: 8px;
  }
`

import css from 'styled-jsx/css'

import {gettext} from '@/utils'

import PromptBoardHeader from '@/components/prompt-board-header'
import PromptBoardResult from '@/components/prompt-board-result'

import PromptList from './prompt-list'

export default function PresetPanel() {
  return (
    <section className="preset-panel">
      <PromptBoardHeader />
      <PromptList />
      <PromptBoardResult
        placeholder={
          gettext(`How to use:\n1. Select text on the webpage, click button\n\n`) +
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
  .preset-panel {
    width: 100%;
  }
`

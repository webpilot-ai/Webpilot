import style from './style.module.scss'

import {gettext} from '@/utils'

import Header from '@/components/popup-header'
import PromptResult from '@/components/prompt-result'
import PromptList from './prompt-list'

export default function PresetPanel() {
  return (
    <section className={style.presetPanel}>
      <Header />
      <PromptList />
      <PromptResult
        placeholder={
          gettext(`Instructions\n1. Select some text on a webpage\n`) +
          gettext(`2. Click the button above`)
        }
      />
    </section>
  )
}

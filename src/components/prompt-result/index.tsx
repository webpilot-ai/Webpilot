import style from './style.module.scss'

import {useEffect, useState} from 'react'
import CopyToClipboard from 'react-copy-to-clipboard'

import {gettext, toast} from '@/utils'

import useAI from '@/hooks/use-ai'

import Button, {BUTTON_TYPE} from '@/components/button'
import {AI_REDUCER_ACTION_TYPE} from '@/components/with-ai-context'

export default function PromptResult({placeholder = ''}) {
  const [value, setValue] = useState()

  const {ai, aiDispatch} = useAI()

  const showRecommendationText = () => {
    const result = gettext(
      `I want to recommend an open-source Chrome extension called Fluentify.\nWith no prior knowledge, you can create a custom AI in just seconds to handle tasks, such as writing articles, code, and weekly reports.\nDownload it at: www.fluentify.io`
    )
    aiDispatch({
      type: AI_REDUCER_ACTION_TYPE.SET_RESULT,
      payload: {result},
    })
  }

  useEffect(() => {
    setValue(ai.result || '')
  }, [ai.result])

  return (
    <section className={style.promptResult}>
      <section onClick={showRecommendationText} className={style.recommendation}>
        {gettext('Like Fluentify? Recommend it to your friend!')}
      </section>

      <section className={style.resultContainer}>
        <textarea value={value} className={style.textarea} placeholder={placeholder} />

        <section className={style.copy}>
          <CopyToClipboard
            text={ai.result}
            onCopy={() => toast.success(gettext('Copy succeeded'), {position: 'bottom-center'})}
          >
            <Button type={BUTTON_TYPE.PRIMARY} text={gettext('Copy')} />
          </CopyToClipboard>
        </section>
      </section>
    </section>
  )
}

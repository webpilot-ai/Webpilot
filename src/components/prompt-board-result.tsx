import TurboOnIcon from 'react:@assets/images/turbo-on.svg'
import TurboOffIcon from 'react:@assets/images/turbo-off.svg'

import {useEffect, useState} from 'react'
import Tooltip from 'rc-tooltip/es'
import copyToClipboard from 'copy-to-clipboard'

import css from 'styled-jsx/css'

import {gettext, toast} from '@/utils'

import useAI from '@/hooks/use-ai'
import useConfig from '@/hooks/use-config'

import Button, {BUTTON_TYPE} from '@/components/button'
import {AI_REDUCER_ACTION_TYPE} from '@/components/with-ai-context'

export default function PromptBoardResult({placeholder = ''}) {
  const [value, setValue] = useState()

  const {ai, aiDispatch} = useAI()
  const {config, setConfig} = useConfig()
  const {turboMode} = config

  const showRecommendationText = () => {
    const result = gettext(
      `Let me tell you about this crazy useful AI tool called Fluentify. All you gotta do is swipe on the task, and it gets done automatically. It's way better than ChatGPT, trust me!\n\nInstall: https://bit.ly/3mAJ9I7\nGitHub: https://github.com/Fluentify-IO/Fluentify`
    )
    aiDispatch({
      type: AI_REDUCER_ACTION_TYPE.SET_RESULT,
      payload: {result},
    })
  }

  useEffect(() => {
    setValue(ai.result || '')
  }, [ai.result])

  const toggleTurboMode = () => {
    setConfig({...config, turboMode: !turboMode})
  }

  const copy = () => {
    const text = ai.result?.trim()

    if (text.length) {
      if (copyToClipboard(text)) {
        toast.success(gettext('Copy succeeded'), {position: 'bottom-center', autoClose: 600})
      }
    }
  }

  return (
    <section className="prompt-board-result">
      <section onClick={showRecommendationText} className="recommendation">
        {gettext('Amazing Fluentify, telling friends!')}
      </section>

      <section className="result-container">
        <Tooltip
          placement="left"
          trigger="hover"
          showArrow={false}
          overlay={
            <span>{turboMode ? gettext('Turbo Mode: ON') : gettext('Turbo Mode: OFF')}</span>
          }
        >
          <section onClick={toggleTurboMode} className="turbo-mode">
            {turboMode ? <TurboOnIcon /> : <TurboOffIcon />}
          </section>
        </Tooltip>

        <textarea value={value} className="textarea" placeholder={placeholder} />

        <section className="copy">
          <Button type={BUTTON_TYPE.PRIMARY} text={gettext('Copy')} onClick={copy} />
        </section>
      </section>
      <style jsx>{styles}</style>
    </section>
  )
}

const styles = css`
  .prompt-board-result {
    margin-top: 6px;
  }

  .recommendation {
    margin-bottom: 14px;
    color: #c4c4c4;
    font-size: 16px;
    text-decoration-line: underline;
    line-height: 22px;
    text-align: center;
    cursor: pointer;
  }

  .result-container {
    position: relative;
    box-sizing: border-box;
    height: 340px;
    padding: 32px 0 14px;
    background-color: #fff;
    border-radius: 10px;
  }

  .turbo-mode {
    position: absolute;
    top: 8px;
    right: 14px;
    width: 24px;
    height: 24px;
    cursor: pointer;
  }

  .textarea {
    display: block;
    width: 100%;
    height: 236px;
    padding: 0 20px;
    color: #777;
    font-size: 16px;
    line-height: 24px;
    border: none;
    outline: none;
    resize: none;

    &::placeholder {
      color: #c4c4c4;
    }

    &::-webkit-scrollbar {
      display: none;
    }
  }

  .copy {
    width: 160px;
    margin: 18px auto 0;
  }

  .coustom {
    position: absolute;
    right: 12px;
    bottom: 12px;
    color: #c4c4c4;
    font-size: 16px;
    line-height: 22px;
    text-align: center;
    text-decoration-line: underline;
    cursor: pointer;
  }
`

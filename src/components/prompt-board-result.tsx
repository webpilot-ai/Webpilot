import {useEffect, useState} from 'react'
import copyToClipboard from 'copy-to-clipboard'

import css from 'styled-jsx/css'
import {useMessage} from '@plasmohq/messaging/hook'

import {gettext, toast} from '@/utils'

import useAI from '@/hooks/use-ai'
import useConfig from '@/hooks/use-config'

import Button, {BUTTON_TYPE} from '@/components/button'
import {AI_REDUCER_ACTION_TYPE} from '@/components/with-ai-context'

import {MESSAGING_EVENT} from '@/config'

export default function PromptBoardResult({placeholder = ''}) {
  const [value, setValue] = useState('')

  const {ai, aiDispatch} = useAI()
  const {config, setConfig} = useConfig()
  const {turboMode} = config

  useMessage((req, res) => {
    const {name} = req
    if (name === MESSAGING_EVENT.CLEAN_DATA) {
      cleanData()
    }
  })

  const cleanData = () => {
    setValue('')
  }

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
      if (copyToClipboard(text, {format: 'text/plain'})) {
        toast.success(gettext('Copy succeeded'), {position: 'bottom-center', autoClose: 600})
      }
    }
  }

  if (value) {
    return (
      <section className="prompt-board-result">
        <section>
          {/* FIXME */}
          Webpilot Says:
        </section>

        <section className="result-container">
          <textarea readOnly value={value} className="textarea" placeholder={placeholder} />

          <section className="copy">
            <section className="share-extension" onClick={showRecommendationText}>
              {gettext('Amazing Fluentify, telling friends!')}
            </section>
            <Button
              width="48px"
              height="24px"
              type={BUTTON_TYPE.PRIMARY}
              text={gettext('Copy')}
              onClick={copy}
            />
          </section>
        </section>
        <style jsx>{styles}</style>
      </section>
    )
  }

  return <></>
}

const styles = css`
  .prompt-board-result {
    margin-top: 12px;
  }

  .result-container {
    position: relative;
    box-sizing: border-box;
    background-color: #fff;

    .title {
      font-weight: normal;
      font-size: 12px;
      color: #777;
      line-height: 17px;
    }
  }

  .textarea {
    margin-top: 4px;
    padding: 10px 12px;
    width: 100%;
    height: 104px;
    border-radius: 5px;
    border: 1px solid #dadada;
    color: #000;
    resize: none;

    &:focus-visible {
      outline: none;
    }

    &::-webkit-scrollbar {
      width: 5px;
    }

    &::-webkit-scrollbar-button {
      display: none;
    }

    &::-webkit-scrollbar-thumb {
      border-radius: 4px;
      background-color: lightgray;
    }
  }

  .copy {
    display: flex;
    width: 100%;
    align-items: flex-end;
    margin-top: 8px;

    .share-extension {
      margin-right: auto;
      text-decoration: underline;
      cursor: pointer;

      &:visited {
        color: #777;
      }
    }
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

const globalStyles = css.global`
  .button {
  }
`

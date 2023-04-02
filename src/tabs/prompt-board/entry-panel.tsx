import {useState} from 'react'
import css from 'styled-jsx/css'
import {sendToContentScript} from '@plasmohq/messaging'

import {gettext} from '@/utils'

import useConfig from '@/hooks/use-config'
import useAI from '@/hooks/use-ai'

import PromptBoardHeader from '@/components/prompt-board-header'
import ConfirmInput from '@/components/confirm-input'
import {MESSAGING_EVENT, ROUTE} from '@/config'

import getAuthKeyImage from '~assets/images/get-auth-key.gif'

export default function EntryPanel() {
  const [inputValue, setInputValue] = useState('')

  const {config, setConfig} = useConfig()
  const {ai, askAI} = useAI()

  const setAuthKey = authKey => {
    askAI({authKey, command: 'Say hi.', onlyCommand: true}).then(() => {
      sendToContentScript({name: MESSAGING_EVENT.CLICK_CLOSE})
      setConfig({...config, authKey, isAuth: true, latestRoute: ROUTE.PROMPT_BOARD_PRESET_PANEL})
    })
  }

  const handleChangeInput = e => {
    const {value} = e.target
    setInputValue(value)
  }

  return (
    <section className="entry-panel">
      <PromptBoardHeader />

      <section className="confirm-input">
        <ConfirmInput
          autoFocus
          value={inputValue}
          disabled={ai.loading}
          loading={ai.loading}
          onConfirm={setAuthKey}
          handleChangeInput={handleChangeInput}
          placeholder={gettext('Enter auth key')}
        />
      </section>

      {ai.loading ? null : (
        <section>
          <div className="tips">
            {gettext('You can find your auth key on the OpenAI website:')}{' '}
            <a
              className="link"
              href="https://platform.openai.com/account/api-keys"
              target="_blank"
              rel="noreferrer"
            >
              https://platform.openai.com/account/api-keys
            </a>
            <div>{gettext('You can also follow the instructions below to get started:')}</div>
          </div>

          {ai.loading ? (
            <div className="loader-container">
              <span className="loader" />
            </div>
          ) : (
            <div className="guide">
              <a href={getAuthKeyImage} target="_blank" rel="noreferrer">
                <img src={getAuthKeyImage} />
              </a>
            </div>
          )}
        </section>
      )}

      <style jsx>{styles}</style>
      <style jsx>{globalStyles}</style>
    </section>
  )
}

const styles = css`
  .entry-panel {
    width: 360px;
    padding: 10px;
  }

  .confirm-input {
    margin: 12px 0;
  }

  .tips {
    display: flex;
    flex-direction: column;
    height: 68px;
    padding: 0 8px;
    color: #c4c4c4;
    font-size: 12px;
    line-height: 16.8px;

    div {
      margin-top: auto;
    }
  }

  .link {
    color: #dec194;
  }

  .guide {
    width: 320px;
    height: 180px;
    margin: 0 8px;
    margin-top: 15px;

    /* background: #ddd; */
    border-radius: 10px;
  }

  .loader-container {
    display: flex;
    justify-content: center;
    margin-top: 100px;
  }

  .loader {
    display: inline-block;
    box-sizing: border-box;
    width: 48px;
    height: 48px;
    border: 5px solid #fff;
    border-bottom-color: #ff3d00;
    border-radius: 50%;
    animation: rotation 1s linear infinite;
  }

  @keyframes rotation {
    0% {
      transform: rotate(0deg);
    }

    100% {
      transform: rotate(360deg);
    }
  }
`

const globalStyles = css.global`
  body {
    overflow: hidden;
  }
`

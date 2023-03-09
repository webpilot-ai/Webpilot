import getAuthKeyImage from '~assets/images/get-auth-key.gif'

import {useEffect, useState} from 'react'
import css from 'styled-jsx/css'

import {gettext} from '@/utils'

import useConfig from '@/hooks/use-config'
import useAI from '@/hooks/use-ai'

import PromptBoardHeader from '@/components/prompt-board-header'
import ConfirmInput from '@/components/confirm-input'
import {ROUTE} from '@/config'

export default function EntryPanel() {
  const [inputValue, setInputValue] = useState('')
  const [disabled, setDisabled] = useState(false)

  const {config, setConfig} = useConfig()
  const {ai, askAI} = useAI()

  useEffect(() => {
    setDisabled(!inputValue || ai.loading)
  }, [inputValue, ai.loading])

  const setAuthKey = authKey => {
    askAI({authKey, command: 'Say hi.', onlyCommand: true}).then(() => {
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
          value={inputValue}
          disabled={disabled}
          loading={ai.loading}
          onConfirm={setAuthKey}
          handleChangeInput={handleChangeInput}
          placeholder={gettext('Enter auth key')}
        />
      </section>

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
          </a>{' '}
          <div>{gettext('You can also follow the instructions below to get started:')}</div>
        </div>

        <div className="guide">
          <a href={getAuthKeyImage} target="_blank" rel="noreferrer">
            <img src={getAuthKeyImage} />
          </a>
        </div>
      </section>

      <style jsx>{styles}</style>
    </section>
  )
}

const styles = css`
  .entry-panel {
    width: 100%;
    height: 554px;
  }

  .confirm-input {
    margin: 28px 0;
  }

  .tips {
    padding: 12px 0;
    color: #c4c4c4;
    font-size: 16px;
    line-height: 22px;

    div {
      margin-top: 12px;
    }
  }

  .link {
    color: #dec194;
  }

  .guide {
    height: 202px;
    margin-top: 20px;
    background: #ddd;
    border-radius: 10px;
  }
`

import style from './style.module.scss'
import getAuthKeyImage from './images/get-auth-key.gif'

import {useEffect, useState} from 'react'
import {useNavigate} from 'react-router'

import {gettext} from '@/utils'

import useConfig from '@/hooks/use-config'
import useAI from '@/hooks/use-ai'

import Header from '@/components/popup-header'
import ConfirmInput from '@/components/confirm-input'

export default function EntryPanel() {
  const [inputValue, setInputValue] = useState('')
  const [disabled, setDisabled] = useState(false)

  const navigate = useNavigate()

  const {config, setConfig} = useConfig()
  const {ai, askAI} = useAI()

  useEffect(() => {
    if (config.isAuth) {
      navigate(config.latestRoute, {replace: true})
    }
  }, [config.isAuth, config.latestRoute, navigate])

  useEffect(() => {
    setDisabled(!inputValue || ai.loading)
  }, [inputValue, ai.loading])

  const setAuthKey = authKey => {
    askAI({authKey, command: 'Say hi.', onlyCommand: true}).then(() => {
      setConfig({...config, authKey, isAuth: true})
    })
  }

  const handleChangeInput = e => {
    const {value} = e.target
    setInputValue(value)
  }

  return (
    <section>
      <Header />

      <section className={style.confirmInput}>
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
        <div className={style.tips}>
          {gettext('You can find your auth key on the OpenAI website:')}{' '}
          <a
            className={style.link}
            href="https://platform.openai.com/account/api-keys"
            target="_blank"
            rel="noreferrer"
          >
            https://platform.openai.com/account/api-keys
          </a>{' '}
          <div>{gettext('You can also follow the instructions below to get started:')}</div>
        </div>

        <div className={style.guide}>
          <a href={getAuthKeyImage} target="_blank" rel="noreferrer">
            <img src={getAuthKeyImage} />
          </a>
        </div>
      </section>
    </section>
  )
}

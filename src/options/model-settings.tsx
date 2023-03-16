import CheckboxIcon from 'react:@assets/images/checkbox.svg'
import CheckboxCheckedIcon from 'react:@assets/images/checkbox-checked.svg'

import {useEffect, useState} from 'react'
import Modal from 'rc-dialog/es'
import css from 'styled-jsx/css'

import {defaultConfig} from '@/config'
import {gettext, toast} from '@/utils'

import useConfig from '@/hooks/use-config'
import useAI from '@/hooks/use-ai'

import FiledItem from '@/components/field-item'
import Button, {BUTTON_TYPE} from '@/components/button'

export default function ModelSettings() {
  const {config, setConfig} = useConfig()
  const {authKey, model} = config

  const [form, setForm] = useState({...model, authKey})
  const [advanced, setAdvanced] = useState(false)
  const [inputtedAuthKey, setInputtedAuthKey] = useState('')
  const [authKeyModelVisible, setAuthKeyModelVisible] = useState(false)

  const {ai, askAI} = useAI()

  useEffect(() => {
    setForm(form => ({...form, ...model, authKey}))
  }, [model, authKey])

  const toggleAuthKeyModelVisible = () => {
    setAuthKeyModelVisible(!authKeyModelVisible)
    setInputtedAuthKey('')
  }

  const toggleAdvanced = () => setAdvanced(!advanced)

  const handleChangeAuthKey = e => setInputtedAuthKey(e.target.value)

  const saveAuthKey = () => {
    form.authKey = inputtedAuthKey
    setForm({...form})
    toggleAuthKeyModelVisible()
  }

  const save = () => {
    const defaultModel = defaultConfig.model
    const currentModel = Object.entries(form)
      .filter(([key, value]) => key !== 'authKey' && value !== '')
      .reduce((acc, [key, value]) => {
        acc[key] = value
        return acc
      }, {})

    const model = {...defaultModel, ...currentModel}

    askAI({authKey: form.authKey, command: 'Say Hi.', onlyCommand: true}).then(() => {
      setConfig({...config, authKey: form.authKey, model, isAuth: true})
      toast.success(gettext('Save succeeded'))
    })
  }

  return (
    <section className="model-panel">
      <section className="header">
        <div className="left">
          <h2 className="model-tanel">{gettext('Model')}</h2>
          <div className="model-name">{model.model}</div>
        </div>
        <div>
          <a
            href="https://platform.openai.com/docs/"
            className="docs"
            target="_blank"
            rel="noreferrer"
          >
            {gettext('Documentation')}
          </a>
        </div>
      </section>

      <section className="body">
        <FiledItem
          secret
          name="authKey"
          title="auth_key"
          placeholder={gettext('Enter auth_key')}
          form={form}
          onClick={toggleAuthKeyModelVisible}
        />
        {advanced ? (
          <>
            <FiledItem
              inputSettings={{type: 'number', min: 0, max: 1, step: 0.1}}
              name="temperature"
              title="temperature (0 ~ 2, default: 1)"
              placeholder="1"
              form={form}
            />
            <FiledItem
              inputSettings={{type: 'number', min: -2, max: 2, step: 0.1}}
              name="frequency_penalty"
              title="frequency_penalty (-2 ~ 2, default: 0)"
              placeholder="0"
              form={form}
            />
            <FiledItem
              inputSettings={{type: 'number', min: -2, max: 2, step: 0.1}}
              name="presence_penalty"
              title="presence_penalty (-2 ~ 2, default: 0)"
              placeholder="0"
              form={form}
            />
          </>
        ) : null}
      </section>

      <section className="footer">
        <div onClick={toggleAdvanced} className="mode">
          <span>{gettext('Advanced')}</span>
          <div className="checkbox">{advanced ? <CheckboxCheckedIcon /> : <CheckboxIcon />}</div>
        </div>

        <div className="save">
          <Button
            text={gettext('Save')}
            type={BUTTON_TYPE.PRIMARY}
            loading={ai.loading}
            onClick={save}
          />
        </div>
      </section>

      <Modal
        title={gettext('Set auth key')}
        visible={authKeyModelVisible}
        style={{marginTop: '300px'}}
        closeIcon={<></>}
        maskClosable={false}
        onClose={toggleAuthKeyModelVisible}
        footer={
          <section className="model-footer">
            <div className="cancel">
              <Button border text={gettext('Dismiss')} onClick={toggleAuthKeyModelVisible} />
            </div>
            <div className="confirm">
              <Button
                border
                type={BUTTON_TYPE.PRIMARY}
                text={gettext('Confirm')}
                onClick={saveAuthKey}
              />
            </div>
          </section>
        }
      >
        <div className="model-body">
          <input value={inputtedAuthKey} onChange={handleChangeAuthKey} className="input" />
        </div>
      </Modal>

      <style jsx>{styles}</style>
    </section>
  )
}

const styles = css`
  .model-panel {
    position: relative;
    min-height: 560px;
    padding: 40px 40px 60px;
    background-color: #fff;
    border-radius: 10px;
  }

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;

    .left {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .model-tanel {
      color: #000;
      font-weight: 600;
      font-size: 16px;
      line-height: 22px;
    }

    .model-name {
      margin-left: 10px;
      color: #7d7d7d;
      font-size: 14px;
      line-height: 20px;
    }

    .docs {
      color: #7d7d7d;
      font-size: 14px;
      line-height: 20px;
      text-decoration-line: underline;
    }
  }

  .advanced {
    margin-top: 42px;
  }

  .footer {
    position: absolute;
    bottom: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 60px;
    padding: 0 40px;

    .mode {
      display: flex;
      align-items: center;
      color: #7d7d7d;
      font-size: 16px;
      line-height: 22px;
      text-align: center;

      .checkbox {
        width: 24px;
        height: 24px;
        margin-left: 4px;
      }
    }

    .save {
      width: 160px;
    }
  }

  .model-body {
    .input {
      display: block;
      width: 100%;
      height: 40px;
      padding: 0 12px;
      color: #000;
      font-size: 16px;
      line-height: 40px;
      word-wrap: normal;
      border: 1px solid #a6a6a6;
      border-radius: 10px;
      outline: 0;

      &::placeholder {
        color: #777;
      }
    }
  }

  .model-footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;

    .cancel,
    .confirm {
      width: 80px;
    }

    .confirm {
      margin-left: 24px;
    }
  }
`

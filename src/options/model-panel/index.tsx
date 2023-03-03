import style from './style.module.scss'
import Checkbox from 'react:./icon/checkbox.svg'
import CheckboxChecked from 'react:./icon/checkbox-checked.svg'

import {useEffect, useState} from 'react'
import Modal from 'rc-dialog/es'

import {defaultConfig} from '@/config'
import {gettext, toast} from '@/utils'

import useConfig from '@/hooks/use-config'
import useAI from '@/hooks/use-ai'

import FiledItem from '@/components/field-item'
import Button, {BUTTON_TYPE} from '@/components/button'

export default function ModelPanel() {
  const {config, setConfig} = useConfig()
  const {ai, askAI} = useAI()

  const {authKey, model} = config

  const [form, setForm] = useState({...model, authKey})

  const [advanced, setAdvanced] = useState(false)

  const [inputtedAuthKey, setInputtedAuthKey] = useState('')
  const [authKeyModelVisible, setAuthKeyModelVisible] = useState(false)

  useEffect(() => {
    setForm(form => ({...form, ...model, authKey}))
  }, [model, authKey])

  const handleChangeAuthKey = e => {
    const {value} = e.target

    setInputtedAuthKey(value)
  }

  const toggleAuthKeyModelVisible = () => {
    setAuthKeyModelVisible(!authKeyModelVisible)
    setInputtedAuthKey('')
  }

  const toggleAdvanced = () => {
    setAdvanced(!advanced)
  }

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
    <section className={style.modelPanel}>
      <section className={style.header}>
        <div className={style.left}>
          <h2 className={style.modelTitle}>{gettext('Model')}</h2>
          <div className={style.modelName}>{model.model}</div>
        </div>
        <div>
          <a
            href="https://platform.openai.com/docs/"
            className={style.docs}
            target="_blank"
            rel="noreferrer"
          >
            {gettext('Documentation')}
          </a>
        </div>
      </section>

      <section className={style.body}>
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
              inputSettings={{type: 'number', min: 100, max: 4000, step: 50}}
              name="max_tokens"
              title="max_tokens (100 ~ 4000, default: 1024)"
              placeholder="1024"
              form={form}
            />
            <FiledItem
              inputSettings={{type: 'number', min: 0, max: 1, step: 0.1}}
              name="top_p"
              title="top_p (0 ~ 1, default: 1)"
              placeholder="1"
              form={form}
            />
            <FiledItem
              inputSettings={{type: 'number', min: 0, max: 1, step: 0.1}}
              name="temperature"
              title="temperature (0 ~ 2, default: 0)"
              placeholder="0"
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

      <section className={style.footer}>
        <div onClick={toggleAdvanced} className={style.mode}>
          <span>{gettext('Advanced')}</span>
          <div className={style.checkbox}>{advanced ? <CheckboxChecked /> : <Checkbox />}</div>
        </div>

        <div className={style.save}>
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
          <section className={style.modalFooter}>
            <div className={style.cancel}>
              <Button border text={gettext('Dismiss')} onClick={toggleAuthKeyModelVisible} />
            </div>
            <div className={style.confirm}>
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
        <div className={style.modalBody}>
          <input value={inputtedAuthKey} onChange={handleChangeAuthKey} className={style.input} />
        </div>
      </Modal>
    </section>
  )
}

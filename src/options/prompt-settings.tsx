import {useEffect, useState} from 'react'
import css from 'styled-jsx/css'

import {gettext, toast} from '@/utils'
import useConfig from '@/hooks/use-config'

import FiledItem from '@/components/field-item'
import Button, {BUTTON_TYPE} from '@/components/button'

export default function PromptSettings({prompt = {}, promptIndex = 0}) {
  const [form, setForm] = useState(prompt)

  const {config, setConfig} = useConfig()

  useEffect(() => {
    setForm({...prompt})
  }, [prompt])

  const save = () => {
    const {prompts} = config
    prompts.splice(promptIndex, 1, {...form})
    setConfig({...config, prompts})

    toast.success(gettext('Save succeeded'))
  }

  return (
    <section className="prompt-panel">
      <section className="body">
        <FiledItem
          name="title"
          title={gettext('Name this')}
          placeholder={gettext('e.g. Summarize')}
          form={form}
          setForm={setForm}
        />

        <FiledItem
          type="textarea"
          name="command"
          title={gettext('Command')}
          placeholder={gettext('e.g. summarize text, be concise')}
          form={form}
        />
      </section>

      <section className="footer">
        <div className="save">
          <Button text={gettext('Save')} type={BUTTON_TYPE.PRIMARY} onClick={save} />
        </div>
      </section>

      <style jsx>{styles}</style>
    </section>
  )
}

const styles = css`
  .prompt-panel {
    position: relative;
    height: 560px;
    padding-top: 40px;
    background-color: #fff;
    border-radius: 10px;
  }

  .body {
    height: 460px;
    padding: 0 40px;
  }

  .tips {
    margin-bottom: 12px;
    color: #7d7d7d;
    font-size: 14px;
    line-height: 20px;
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
    justify-content: flex-end;
    width: 100%;
    height: 60px;
    padding: 0 40px;
  }

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
`

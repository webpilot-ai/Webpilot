import style from './style.module.scss'

import {useEffect, useState} from 'react'

import {gettext, toast} from '@/utils'
import useConfig from '@/hooks/use-config'

import FiledItem from '@/components/field-item'
import Button, {BUTTON_TYPE} from '@/components/button'

export default function PromptPanel({prompt = {}, promptIndex = 0}) {
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
    <section className={style.promptPanel}>
      <section className={style.body}>
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

      <section className={style.footer}>
        <div className={style.save}>
          <Button text={gettext('Save')} type={BUTTON_TYPE.PRIMARY} onClick={save} />
        </div>
      </section>
    </section>
  )
}

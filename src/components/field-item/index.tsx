import style from './style.module.scss'
import 'rc-dialog/assets/index.css'

import Pen from 'react:./icon/pen.svg'

import {useEffect, useRef, useState} from 'react'

export default function FiledItem({
  form,
  type = 'input',
  name = '',
  title = '',
  subtitle = '',
  placeholder = '',
  secret = false,
  inputSettings = {},
  onClick = () => null,
}) {
  const textareaEl = useRef(null)

  const [value, setValue] = useState(form[name])

  const [maskValue, setMaskValue] = useState(maskText(value))

  useEffect(() => {
    const value = form[name]

    setValue(value)
    secret && setMaskValue(maskText(value))
  }, [secret, form, name])

  useEffect(() => {
    form[name] = value
  }, [form, name, value])

  useEffect(() => {
    const textarea = textareaEl.current
    if (!textarea) return
    textarea.style.height = '22px'
    textarea.scrollTop = 0
    textarea.style.height = `${textarea.scrollHeight}px`
  }, [value])

  const handleChangeInput = e => {
    let {value} = e.target
    const {type} = inputSettings

    if (value !== '' && type === 'number') {
      value = Number(value)
    }

    setValue(value)
  }

  const handleBlurInput = e => {
    let {value} = e.target

    const {type, min, max} = inputSettings

    if (value !== '' && type === 'number') {
      value = Number(value)
    }

    if (value < min) value = min
    if (value > max) value = max

    setValue(value)
  }

  return (
    <section className={style.filedItem}>
      <section className={style.header}>
        <h2 className={style.title}>{title}</h2>
        <h3 className={style.subtitle}>{subtitle}</h3>
      </section>

      <section className={style.body} onClick={onClick}>
        {type === 'textarea' ? (
          <textarea
            {...inputSettings}
            ref={textareaEl}
            value={secret ? maskValue : value}
            disabled={secret}
            placeholder={placeholder}
            onChange={handleChangeInput}
            onBlur={handleBlurInput}
            className={`${style.textarea} ${secret && style.secret}`}
          />
        ) : null}
        {type === 'input' ? (
          <input
            {...inputSettings}
            value={secret ? maskValue : value}
            disabled={secret}
            placeholder={placeholder}
            onChange={handleChangeInput}
            onBlur={handleBlurInput}
            className={`${style.textarea} ${secret && style.secret}`}
          />
        ) : null}
        {secret ? (
          <section className={style.edit}>
            <Pen />
          </section>
        ) : null}
      </section>
    </section>
  )
}

function maskText(text = '') {
  let regexp = /^(.{5}).*(.{5})$/
  if (text.length <= 10) {
    regexp = /^(.{1}).*(.{1})$/
  }

  return String(text).replace(regexp, (m, p1, p2) => {
    return `${p1}****${p2}`
  })
}

import 'rc-dialog/assets/index.css'
import PenIcon from 'react:@assets/images/pen.svg'

import {useEffect, useRef, useState} from 'react'
import css from 'styled-jsx/css'

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
    textarea.style.scrollTop = 0
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
    <section className="filed-item">
      <section className="header">
        <h2 className="title">{title}</h2>
        <h3 className="subtitle">{subtitle}</h3>
      </section>

      <section className="body" onClick={onClick}>
        {type === 'textarea' ? (
          <textarea
            {...inputSettings}
            ref={textareaEl}
            value={secret ? maskValue : value}
            disabled={secret}
            placeholder={placeholder}
            onChange={handleChangeInput}
            onBlur={handleBlurInput}
            className={`textarea ${secret && 'secret'}`}
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
            className={`textarea ${secret && 'secret'}`}
          />
        ) : null}
        {secret ? (
          <section className="edit">
            <PenIcon />
          </section>
        ) : null}
      </section>

      <style jsx>{styles}</style>
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

const styles = css`
  .filed-item {
    margin-bottom: 20px;
    border-bottom: 1px solid #a6a6a6;
  }

  .header {
    display: flex;

    .title {
      color: #000;
      font-weight: 600;
      font-size: 14px;
      line-height: 20px;
    }

    .subtitle {
      margin-left: 8px;
      color: #7d7d7d;
      font-size: 12px;
      line-height: 20px;
    }
  }

  .body {
    position: relative;

    .textarea {
      display: block;
      width: 100%;
      height: 22px;
      margin-top: 8px;
      padding: 0 4px;
      color: #000;
      font-size: 16px;
      line-height: 22px;
      word-wrap: normal;
      border: none;
      outline: 0;
      resize: none;

      &::placeholder {
        color: #777;
      }

      &:disabled {
        background-color: #fff;
      }

      &.secret {
        cursor: pointer;
      }
    }

    .edit {
      position: absolute;
      right: 0;
      bottom: 0;
      width: 24px;
      height: 24px;
      padding: 4px;
      cursor: pointer;
    }
  }
`

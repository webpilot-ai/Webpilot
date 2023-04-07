import {useCallback, useEffect, useRef, useState} from 'react'
import CheckIcon from 'react:@assets/images/vector.svg'
import LoadingIcon from 'react:@assets/images/loading.svg'

import css from 'styled-jsx/css'

export default function ConfirmInput({
  command = '',
  placeholder = '',
  loading = false,
  disabled = false,
  onTextChange = () => null,
  onConfirm = () => null,
}) {
  const inputRef = useRef()
  const [isActive, setActive] = useState(false)
  const [value, setValue] = useState(command)

  const keydownHandler = useCallback(
    e => {
      if ((e.key === 'Enter' || e.keyCode === 13) && !e.repeat) {
        if (inputRef.current) {
          onConfirm(inputRef.current.value)
        }
      }
    },
    [onConfirm]
  )

  useEffect(() => {
    setValue(command)
  }, [command])

  const addKeydownEventListener = () => {
    setActive(true)
    document.addEventListener('keydown', keydownHandler)
  }

  const removeKeydownEventListener = () => {
    setActive(false)
    document.removeEventListener('keydown', keydownHandler)
  }

  const handleChangeInput = e => {
    const {value} = e.target
    setValue(value)
    onTextChange(value)
  }

  return (
    <section className={`confirm-input ${isActive && 'confirm-input--active'}`}>
      <input
        ref={inputRef}
        autoFocus
        disabled={disabled}
        placeholder={placeholder}
        id="prompt-input"
        className="input"
        onChange={handleChangeInput}
        onFocus={addKeydownEventListener}
        onBlur={removeKeydownEventListener}
        value={value}
      />
      <div className="confirm">
        <button
          disabled={disabled}
          className={`send-btn ${isActive && (value !== '' || placeholder !== '') && 'active'} ${
            loading && 'loading'
          }`}
          onClick={() => onConfirm(value)}
        >
          {loading ? <LoadingIcon className="loading" /> : <CheckIcon className="icon" />}
        </button>
      </div>

      <style jsx>{styles}</style>
    </section>
  )
}

const styles = css`
  .confirm-input {
    position: relative;
    display: flex;
    height: 32px;
    margin-top: 12px;
    overflow: hidden;
    border: 1px solid lightgray;
    border-radius: 5px;
  }

  /* TODO: Bug fix */
  .confirm-input--active {
    border-bottom: 1px solid #2d5eae;
  }

  .input {
    display: block;
    width: 100%;
    padding: 0 12px;
    color: #777;
    font-size: 16px;
    font-size: 12px;
    line-height: 40px;
    border: none;
    outline: none;

    &::placeholder {
      color: #777;
      font-size: 12px;
    }
  }

  .confirm {
    flex: none;
    width: 40px;

    .send-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      background-color: rgb(0 0 0 / 0%);
      border: 0;
      cursor: pointer;
      fill: #dadada;

      &.active {
        fill: #2d5eae;
      }

      &:disabled {
        cursor: not-allowed;
      }

      &.loading {
        cursor: not-allowed;
        animation: rotation 1s infinite linear;
      }
    }
  }

  @keyframes rotation {
    from {
      transform: rotate(0deg);
    }

    to {
      transform: rotate(359deg);
    }
  }
`

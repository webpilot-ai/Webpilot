import CheckIcon from 'react:@assets/images/check.svg'

import css from 'styled-jsx/css'

import Button from './button'

export default function ConfirmInput({
  value = '',
  placeholder = '',
  loading = false,
  disabled = false,
  handleChangeInput = () => null,
  onConfirm = () => null,
}) {
  return (
    <section className="confirm-input">
      <input
        placeholder={placeholder}
        className="input"
        onChange={handleChangeInput}
        value={value}
      />

      <div className="confirm">
        <Button
          compact
          type="primary"
          loading={loading}
          disabled={disabled}
          onClick={() => onConfirm(value)}
        >
          <div className="icon">
            <CheckIcon />
          </div>
        </Button>
      </div>

      <style jsx>{styles}</style>
    </section>
  )
}

const styles = css`
  .confirm-input {
    display: flex;
  }

  .input {
    display: block;
    width: 100%;
    height: 40px;
    padding: 0 12px;
    color: #777;
    font-size: 16px;
    line-height: 40px;
    border: none;
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
    outline: none;

    &::placeholder {
      color: #c4c4c4;
    }
  }

  .confirm {
    flex: none;
    width: 60px;
  }

  .icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
  }
`

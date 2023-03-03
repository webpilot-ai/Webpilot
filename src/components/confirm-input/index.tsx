import style from './style.module.scss'

import Button from '../button'
import Check from 'react:./icon/check.svg'

export default function ConfirmInput({
  value = '',
  placeholder = '',
  loading = false,
  disabled = false,
  handleChangeInput = () => null,
  onConfirm = () => null,
}) {
  return (
    <section className={style.confirmInput}>
      <input
        placeholder={placeholder}
        className={style.input}
        onChange={handleChangeInput}
        value={value}
      />

      <div className={style.confirm}>
        <Button
          compact
          type="primary"
          loading={loading}
          disabled={disabled}
          onClick={() => onConfirm(value)}
        >
          <div className={style.icon}>
            <Check />
          </div>
        </Button>
      </div>
    </section>
  )
}

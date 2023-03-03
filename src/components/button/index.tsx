import Tooltip from 'rc-tooltip/es'

import style from './style.module.scss'
import 'rc-tooltip/assets/bootstrap.css'

import QuestionCircle from 'react:./icon/question-circle.svg'

const noop = () => null

export default function Button({
  type = BUTTON_TYPE.DEFAULT,
  disabled = false,
  loading = false,
  selected = false,
  compact = false,
  text = '',
  tooltip = '',
  Icon = null,
  border = false,
  children = null,
  onClick = () => null,
}) {
  return (
    <button
      className={`${style.button} ${style[type]} ${compact && style.compact}
      ${disabled && style.disabled} ${loading && style.loading} ${selected && style.selected}
      ${border && style.withBorder} ${tooltip && style.withTooltip} ${
        !disabled && style.withInteractive
      }`}
      onClick={disabled ? noop : onClick}
    >
      {loading ? (
        <span className={style.loader} />
      ) : (
        children || (
          <>
            <span>{text}</span>
            {tooltip ? (
              <Tooltip
                placement="bottom"
                trigger="hover"
                showArrow={false}
                overlay={<span>{tooltip}</span>}
              >
                <span className={style.icon}>{Icon ? <Icon /> : <QuestionCircle />}</span>
              </Tooltip>
            ) : null}
          </>
        )
      )}
    </button>
  )
}

export const BUTTON_TYPE = {
  DEFAULT: 'default',
  PRIMARY: 'primary',
}

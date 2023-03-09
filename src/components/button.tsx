import 'rc-tooltip/assets/bootstrap.css'
import QuestionCircleIcon from 'react:@assets/images/question-circle.svg'

import Tooltip from 'rc-tooltip/es'
import css from 'styled-jsx/css'

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
      className={`button ${type} ${compact && 'compact'}
      ${disabled && 'disabled'} ${loading && 'loading'} ${selected && 'selected'}
      ${border && 'withBorder'} ${tooltip && 'withTooltip'} ${!disabled && 'withInteractive'}`}
      onClick={disabled ? noop : onClick}
    >
      {loading ? (
        <span className="loader" />
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
                <span className="icon">{Icon ? <Icon /> : <QuestionCircleIcon />}</span>
              </Tooltip>
            ) : null}
          </>
        )
      )}
      <style jsx>{styles}</style>
    </button>
  )
}

export const BUTTON_TYPE = {
  DEFAULT: 'default',
  PRIMARY: 'primary',
}

const styles = css`
  .button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    min-height: 40px;
    padding: 8px 14px;
    color: #7d7d7d;
    font-size: 16px;
    text-align: center;
    border: none;
    border-radius: 10px;
    outline: none;
    cursor: pointer;

    &.default {
      background-color: #fff;
    }

    &.primary {
      background-color: #f3e0c2;
    }

    &.compact {
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
    }

    &.disabled {
      color: #a6a6a6;
      background-color: #ddd;
    }

    &.withTooltip {
      justify-content: space-between;
    }

    &.withBorder {
      border-color: #a6a6a6;
      border-style: solid;
      border-width: 1px;
    }

    &.withInteractive {
      &:hover {
        background-color: #e6cfab !important;
      }

      &:active {
        background-color: #dec194 !important;
      }
    }

    &.loading {
      background-color: #dec194;

      &:hover {
        background-color: #dec194 !important;
      }

      &:active {
        background-color: #dec194 !important;
      }
    }

    &.selected {
      background-color: #dec194;

      &:hover {
        background-color: #dec194 !important;
      }

      &:active {
        background-color: #dec194 !important;
      }
    }
  }

  .icon {
    width: 16px;
    height: 16px;
    margin-left: 16px;
    cursor: help;
  }

  .loader {
    position: relative;
    display: block;
    box-sizing: border-box;
    width: 4px;
    height: 16px;
    margin: 0 auto;
    color: #fff;
    background: #777;
    border-radius: 4px;
    animation: animloader 0.3s 0.3s linear infinite alternate;

    &::after,
    &::before {
      position: absolute;
      top: 50%;
      left: 8px;
      box-sizing: border-box;
      width: 4px;
      height: 16px;
      background: #777;
      border-radius: 4px;
      transform: translateY(-50%);
      animation: animloader 0.3s 0.45s linear infinite alternate;
      content: '';
    }

    &::before {
      left: -8px;
      animation-delay: 0s;
    }
  }

  @keyframes animloader {
    0% {
      height: 20px;
    }

    100% {
      height: 8px;
    }
  }
`

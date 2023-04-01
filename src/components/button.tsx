import 'rc-tooltip/assets/bootstrap.css'

import css from 'styled-jsx/css'

const noop = () => null

export default function Button({
  width = null,
  height = null,
  type = BUTTON_TYPE.DEFAULT,
  active = false,
  disabled = false,
  loading = false,
  selected = false,
  compact = true,
  text = '',
  Icon = null,
  border = false,
  children = null,
  onClick = () => null,
}) {
  return (
    <button
      style={{width, height}}
      className={`button ${type} ${compact && 'compact'}
      ${disabled && 'disabled'} ${loading && 'loading'} ${selected && 'selected'}
      ${border && 'withBorder'}  ${!disabled && 'withInteractive'} ${active && 'active'}`}
      onClick={disabled ? noop : onClick}
    >
      {children || (
        <>
          <span>{text}</span>
        </>
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
    min-height: 20px;
    padding: 8px 14px;
    color: #7d7d7d;
    font-size: 10px;
    text-align: center;
    border: none;
    border-radius: 5px;
    outline: none;
    cursor: pointer;

    &.default {
      color: #4f5aff;
      border: 1px solid #4f5aff;
      background-color: #fff;

      &:hover {
        color: #4128d3;
        border-color: #4128d3;
      }

      &:active {
        color: #1a039f;
        border-color: #1a039f;
        background-color: #9cb2ff;
      }
    }

    &.primary {
      background-color: #4f5aff;
      color: #fff;

      &:hover {
        background-color: #4128d3;
      }
      &:active {
        background-color: #1a039f;
      }
    }

    &.compact {
      height: 20px;
      padding: 1px 8px;
    }

    &.disabled {
      border: 1px solid #8f95b5;
      background-color: #e8ebfa;
      color: #888fb8;

      &:hover {
        cursor: not-allowed;
      }
    }

    &.withBorder {
      border-color: #a6a6a6;
      border-style: solid;
      border-width: 1px;
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
      color: #ffffff;
      background: linear-gradient(0deg, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), #4f5aff;
    }

    &.active {
      color: #ffffff;
      background-color: #4f5aff;
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

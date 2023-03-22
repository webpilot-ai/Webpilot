import css from 'styled-jsx/css'

import PromptBoard from './tabs/prompt-board'

export default function Popup() {
  // const popupURL = chrome?.runtime?.getURL('tabs/prompt-board.html')

  return (
    <section className="popup">
      <PromptBoard />
      <style jsx>{styles}</style>
      <style jsx global>
        {globalStyles}
      </style>
    </section>
  )
}

const styles = css`
  .popup {
    width: 360px;
    /* height: 376px; */
    overflow: hidden;
    box-shadow: 0 2px 6px rgb(0 0 0 / 30%);
  }

  .iframe {
    width: 360px;
    height: 376px;
    overflow: hidden;
    border: none;
  }
`

const globalStyles = css.global`
  html:focus-within {
    scroll-behavior: smooth;
  }

  body {
    margin: 0;
    text-rendering: optimizespeed;
    line-height: 1.5;
  }

  .icon:hover * {
    fill: #000;
  }
`

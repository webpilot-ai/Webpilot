import css from 'styled-jsx/css'

export default function Popup() {
  const popupURL = chrome?.runtime?.getURL('tabs/prompt-board.html')

  return (
    <section className="popup">
      {popupURL ? <iframe src={popupURL} className="iframe" frameBorder="0" /> : null}

      <style jsx>{styles}</style>
      <style jsx global>
        {globalStyles}
      </style>
    </section>
  )
}

const styles = css`
  .popup {
    width: 400px;
    height: 594px;
    overflow: hidden;
    box-shadow: 0 2px 6px rgb(0 0 0 / 30%);
  }

  .iframe {
    width: 400px;
    height: 594px;
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

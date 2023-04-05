import css from 'styled-jsx/css'

import {useState} from 'react'

import Logo from 'react:@assets/images/advanced/logo.svg'

export default function Advanced() {
  const [inputValue, setInputValue] = useState('')

  const handleInputChange = event => {
    setInputValue(event.target.value)
  }

  return (
    <section className="advanced">
      <section className="header">
        <img src={Logo} alt="" />
        <span className="title">gpt-3.5-turbo</span>
        <a href="#">Document</a>
      </section>

      <section className="inputs">
        <div className="input-group">
          <label htmlFor="authKey">Auth-key</label>
          <input
            type="text"
            placeholder="Type something..."
            value={inputValue}
            onChange={handleInputChange}
          />
        </div>

        <div className="input-group">
          <label htmlFor="authKey">Top p</label>
          <input type="text" name="topP" id="topP" />
        </div>

        <div className="input-group">
          <label htmlFor="authKey">frequency_penalty </label>
          <input type="text" name="frequency_penalty" id="frequency_penalty" />
        </div>
      </section>
      <style jsx>{styles}</style>
    </section>
  )
}

const styles = css`
  .advanced {
    margin-top: 28px;
    padding: 22px 32px;
    background-color: #fff;
    border-radius: 10px;

    .header {
      display: flex;

      img {
        margin-right: 8px;
      }

      .title {
        margin-right: 13px;
        color: #4f5aff;
        font-weight: 400;
        font-size: 18px;
        line-height: 25px;
      }

      a {
        font-weight: 400;
        font-size: 14px;
        line-height: 20px;
      }
    }

    .inputs {
      display: flex;
      flex-direction: column;
      margin-top: 16px;

      .input-group {
        display: flex;
        flex-direction: column;
        margin-bottom: 38px;

        label {
          margin-bottom: 9px;
          color: #292929;
          font-weight: 400;
          font-size: 18px;
          line-height: 25px;
        }

        input {
          box-sizing: border-box;
          width: 280px;
          height: 36px;
          background: #fff;
          border: 1px solid #dcdee1;

          &:focus-visible {
            border: 1px solid #dcdee1;
          }
        }
      }
    }
  }
`

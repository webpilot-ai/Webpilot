import css from 'styled-jsx/css'

import {useState, useEffect} from 'react'
import Logo from 'data-base64:~assets/images/advanced/logo.svg'
import DeleteIcon from 'react:@assets/images/advanced/delete.svg'

import useConfig from '@/hooks/use-config'
import Button, {BUTTON_TYPE} from '@/components/button'
import {gettext} from '@/utils'

export default function Advanced() {
  const {config, setConfig} = useConfig()
  const [authKeyValue, setAuthKeyInputValue] = useState('')
  const [topP, setTopP] = useState(0.9)
  const [frequencyPenalty, setFrequencyPenalty] = useState(0)

  useEffect(() => {
    setAuthKeyInputValue(config.authKey)
    setTopP(config.model.top_p ?? 0.9)
    setFrequencyPenalty(config.model.frequency_penalty ?? 0)
  }, [config])

  const hideAuthKey = authKey => {
    const firstFive = authKey.slice(0, 6) // 获取前5个字符
    const lastFive = authKey.slice(-4) // 获取后5个字符
    const middle = '*'.repeat(3) // 构造中间部分的*号
    return firstFive + middle + lastFive // 拼接字符串
  }

  const handleAuthKeyInputChange = event => {
    setAuthKeyInputValue(event.target.value)
  }

  const handleTopPInputChange = event => {
    setTopP(event.target.value)
  }

  const handlFrequencyPenaltyInputChange = event => {
    setFrequencyPenalty(event.target.value)
  }

  const inputOnfoucs = event => {
    const labelId = event.target.name + '_label'
    window.document.querySelector('#' + labelId).style.color = '#4F5AFF'
  }

  const inputOutfoucs = event => {
    const labelId = event.target.name + '_label'
    window.document.querySelector('#' + labelId).style.color = 'black'
  }

  const saveSettings = () => {
    config.authKey = authKeyValue
    config.model.top_p = topP
    config.model.frequency_penalty = frequencyPenalty
    setConfig({...config})
    alert('Settings Saved.')
  }

  const [isEditing, setIsEditing] = useState(false)

  const document = 'https://platform.openai.com/docs/'

  const cleanAuthKey = () => {
    setAuthKeyInputValue('')
    setIsEditing(true)
  }

  return (
    <section className="advanced">
      <div className="body">
        <section className="header">
          <img src={Logo} alt="" />
          <span className="title">gpt-3.5-turbo</span>
          <a href={document} target="_black">
            Document
          </a>
        </section>
        <section className="inputs">
          <div className="input-group">
            <label id="auth_key_label">Auth-key</label>
            <div className="input-container">
              <input
                type="text"
                placeholder="Type something..."
                value={isEditing ? authKeyValue : hideAuthKey(authKeyValue)}
                onChange={handleAuthKeyInputChange}
                readOnly={!isEditing}
                onFocus={inputOnfoucs}
                onBlur={inputOutfoucs}
                name="auth_key"
              />
              <span className="delete_authKey">
                <DeleteIcon className="delete_icon" onClick={cleanAuthKey} />
              </span>
            </div>
          </div>

          <div className="input-group">
            <label id="top_p_label">Top p</label>
            <input
              type="number"
              value={topP}
              onChange={handleTopPInputChange}
              onFocus={inputOnfoucs}
              onBlur={inputOutfoucs}
              name="top_p"
              min="0"
              max="1"
              step="0.1"
            />
            <span className="hint">0 ~ 1, default: 0.9</span>
          </div>

          <div className="input-group">
            <label id="frequency_penalty_label">frequency_penalty</label>
            <input
              type="number"
              value={frequencyPenalty}
              onChange={handlFrequencyPenaltyInputChange}
              onFocus={inputOnfoucs}
              onBlur={inputOutfoucs}
              name="frequency_penalty"
              min="-2"
              max="2"
            />
            <span className="hint">-2 ~ 2, default: 0</span>
          </div>
        </section>
      </div>
      <div className="footer">
        <Button
          width="143px"
          height="36px"
          type={BUTTON_TYPE.PRIMARY}
          text={gettext('SAVE CHANGE')}
          onClick={saveSettings}
        />
      </div>
      <style jsx>{styles}</style>
    </section>
  )
}

const styles = css`
  .advanced {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 578px;
    margin-top: 28px;
    padding: 22px 16px 22px 32px;
    background-color: #fff;
    border-radius: 10px;

    .header {
      display: flex;

      img {
        width: 22px;
        height: 22px;
        margin-top: 3px;
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
        padding-top: 4px;
        color: #4f5aff;
        font-weight: 400;
        font-size: 14px;
        line-height: 18px;
        text-decoration-line: underline;
      }
    }

    .inputs {
      display: flex;
      flex-direction: column;
      margin-top: 16px;

      .input-group {
        display: flex;
        flex-direction: column;

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
          font-weight: 400;
          font-size: 14px;
          line-height: 20px;
          background: #fff;
          border: 1px solid #dcdee1;

          &:focus-visible {
            border: 1px solid #dcdee1;
          }
        }

        .delete_authKey {
          position: relative;
          top: 5px;
          left: -30px;
          cursor: pointer;
        }

        .delete_icon {
          vertical-align: middle;
        }

        .hint {
          margin-top: 8px;
          color: #929497;
          font-weight: 500;
          font-size: 12px;
          line-height: 17px;
        }
      }

      .input-group:not(:last-child) {
        margin-bottom: 38px;
      }
    }

    .footer {
      display: flex;
      flex-direction: row-reverse;

      @media screen and (max-width: 500px) {
        flex-direction: row;
      }
    }
  }
`

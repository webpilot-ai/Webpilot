import css from 'styled-jsx/css'

import {useState, useEffect} from 'react'
import Logo from 'data-base64:~assets/images/advanced/logo.svg'
import DeleteOutlineIcon from 'react:@assets/images/delete-outline.svg'

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
    const firstFive = authKey.slice(0, 5) // 获取前5个字符
    const lastFive = authKey.slice(-5) // 获取后5个字符
    const middle = '*'.repeat(10) // 构造中间部分的*号
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

  const saveSettings = () => {
    config.authKey = authKeyValue
    config.model.top_p = topP
    config.model.frequency_penalty = frequencyPenalty
    setConfig({...config})
    alert('Settings Saved.')
  }

  const [isEditing, setIsEditing] = useState(false)

  const cleanAuthKey = () => {
    setAuthKeyInputValue('')
    setIsEditing(true)
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
          <label>Auth-key</label>
          <div className="input-container">
            <input
              type="text"
              placeholder="Type something..."
              value={isEditing ? authKeyValue : hideAuthKey(authKeyValue)}
              onChange={handleAuthKeyInputChange}
              readOnly={!isEditing}
            />
            <span className="delete_authKey">
              <DeleteOutlineIcon className="delete_icon" onClick={cleanAuthKey} />
            </span>
          </div>
        </div>

        <div className="input-group">
          <label>Top p</label>
          <input
            type="text"
            placeholder="Type something..."
            value={topP}
            onChange={handleTopPInputChange}
          />
          <span className="hint">0 ~ 1, default: 0.9</span>
        </div>

        <div className="input-group">
          <label>frequency_penalty </label>
          <input
            type="text"
            placeholder="Type something..."
            value={frequencyPenalty}
            onChange={handlFrequencyPenaltyInputChange}
          />
          <span className="hint">-2 ~ 2, default: 0</span>
        </div>

        <div className="input-group save">
          <Button
            width="143px"
            height="36px"
            type={BUTTON_TYPE.PRIMARY}
            text={gettext('SAVE CHANGE')}
            onClick={saveSettings}
          />
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

        .delete_authKey {
          margin-left: -25px;
          cursor: pointer;
        }
        .delete_icon {
          vertical-align: middle;
        }
        .hint {
          margin-top: 8px;
          font-weight: 500;
          font-size: 12px;
          line-height: 17px;
          color: #929497;
        }
      }

      .input-group:not(:last-child) {
        margin-bottom: 38px;
      }

      .input-group:last-child {
        flex-direction: row-reverse;
      }
    }
  }
`

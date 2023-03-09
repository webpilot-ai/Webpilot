import SettingsIcon from 'react:@assets/images/settings.svg'
import ArrowLeftIcon from 'react:@assets/images/arrow-left.svg'
import AutoPopupIcon from 'react:@assets/images/auto-popup.svg'

import Tooltip from 'rc-tooltip/es'
import css from 'styled-jsx/css'

import {gettext, navToOptions} from '@/utils'
import useConfig from '@/hooks/use-config'

export default function PromptBoardHeader({children = null, back = null}) {
  const {config, setConfig} = useConfig()
  const {autoPopup, isAuth} = config

  const toggleAutoPopup = () => {
    setConfig({...config, autoPopup: !autoPopup})
  }

  return (
    <section className="header">
      {back ? (
        <div onClick={back} className="back">
          <ArrowLeftIcon />
        </div>
      ) : (
        children || (
          <section className="header-left">
            <h1 className="title">Fluentify</h1>

            <Tooltip
              showArrow={false}
              placement="right"
              overlay={() => <span>{gettext('Settings')}</span>}
            >
              <div onClick={navToOptions} className="settings svg-icon">
                <SettingsIcon />
              </div>
            </Tooltip>
          </section>
        )
      )}
      {isAuth ? (
        <section>
          <Tooltip
            showArrow={false}
            placement="left"
            overlay={() => (
              <span>{autoPopup ? gettext('Auto Pop: ON') : gettext('Auto Pop: OFF')}</span>
            )}
          >
            <section className="auto-popup" onClick={toggleAutoPopup}>
              <AutoPopupIcon
                className={`auto-popup-icon ${
                  autoPopup ? 'auto-popup-icon--on' : 'auto-popup-icon--off'
                }`}
              />
            </section>
          </Tooltip>
        </section>
      ) : null}

      <style jsx>{styles}</style>
      <style jsx global>
        {globalStyles}
      </style>
    </section>
  )
}

const styles = css`
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 44px;
  }

  .header-left {
    display: flex;
    align-items: center;
  }

  .title {
    color: #000;
    font-weight: 600;
    font-size: 36px;
  }

  .settings {
    width: 24px;
    height: 24px;
    margin-left: 12px;
    font-size: 0;
    cursor: pointer;
  }

  .back {
    width: 24px;
    height: 24px;
    cursor: pointer;
  }

  .auto-popup {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    cursor: pointer;
  }
`

const globalStyles = css.global`
  .auto-popup-icon--on {
    path {
      fill: #dec194;
    }
  }

  .auto-popup-icon--off {
    path {
      fill: #c4c4c4;
    }
  }
`

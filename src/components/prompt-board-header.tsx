import CameraFlashIcon from 'react:@assets/images/camera-flash.svg'
import PreferencesIcon from 'react:@assets/images/preferences.svg'
import RemoveIcon from 'react:@assets/images/e-remove.svg'

import {sendToContentScript} from '@plasmohq/messaging'
import Tooltip from 'rc-tooltip/es'
import css from 'styled-jsx/css'

import {gettext} from '@/utils'
import useConfig from '@/hooks/use-config'

import {MESSAGING_EVENT} from '@/config'

export default function PromptBoardHeader({hideTurboMode = false}) {
  const {config, setConfig} = useConfig()
  const {turboMode, isAuth} = config

  const toggleTurboMode = () => {
    setConfig({...config, turboMode: !turboMode})
  }

  const openSettings = () => {
    window.open('/options.html')
  }

  const closePopup = () => {
    sendToContentScript({name: MESSAGING_EVENT.CLICK_CLOSE})
  }

  return (
    <section className="header">
      <span>LOGO</span>
      <h1 className="title">Working With Webpilot</h1>
      {isAuth ? (
        <ul role="list" className="header-settings">
          <li className="d-inline">{turboMode ? gettext('Turbo Mode: ON') : ''}</li>
          {hideTurboMode ? undefined : (
            <li>
              <section>
                <Tooltip
                  showArrow={false}
                  placement="left"
                  overlay={() => (
                    <span>
                      {turboMode ? gettext('Turbo Mode: ON') : gettext('Turbo Mode: OFF')}
                    </span>
                  )}
                >
                  <section className="setting-icon camera-falsh" onClick={toggleTurboMode}>
                    <CameraFlashIcon
                      className={`settings  ${
                        turboMode ? 'setting-icon--on' : 'setting-icon--off'
                      }`}
                    />
                  </section>
                </Tooltip>
              </section>
            </li>
          )}

          <li>
            <section>
              <Tooltip
                showArrow={false}
                placement="left"
                overlay={() => <span>{gettext('Settings')}</span>}
              >
                <section className="setting-icon " onClick={openSettings}>
                  <PreferencesIcon />
                </section>
              </Tooltip>
            </section>
          </li>
          <li>
            <section>
              <section className="setting-icon " onClick={closePopup}>
                <RemoveIcon />
              </section>
            </section>
          </li>
        </ul>
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
    height: 19px;

    .header-settings {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;

      li + li {
        margin-left: 14px;
      }
    }
  }

  .title {
    margin-right: auto;
    margin-left: 10px;
    color: #000;
    font-weight: 600;
    font-size: 12px;
  }
`

const globalStyles = css.global`
  .header-settings {
    .setting-icon {
      width: 14px;
      height: 14px;
      cursor: pointer;
    }
  }
  .setting-icon--on {
    path {
      fill: #2d5eae;
      stroke: #2d5eae;
    }
  }

  .setting-icon--off {
    path {
      stroke: #777777;
    }
  }
`

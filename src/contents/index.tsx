import 'rc-tooltip/assets/bootstrap.css'
import cssText from 'data-text:./index.scss'
import Logo from 'data-base64:~assets/icon.png'

import {useEffect, useState} from 'react'
import {useTextSelection} from 'ahooks'
import {sendToBackground} from '@plasmohq/messaging'
import {useMessage} from '@plasmohq/messaging/hook'

import {MESSAGING_EVENT} from '@/config'
import useConfig from '@/hooks/use-config'

export default function Index() {
  const [overlayVisible, setOverlayVisible] = useState(false)
  const [floatingLogoVisible, setFloatingLogoVisible] = useState(false)
  const [floatingPosition, setFloatingPosition] = useState({clientX: 0, clientY: 0})

  const selection = useTextSelection()
  const {config} = useConfig()
  const {isAuth, autoPopup, turboMode} = config

  useMessage((req, res) => {
    if (req.name === MESSAGING_EVENT.GET_SELECTED_TEXT) {
      const selectedText = selection.text
      res.send(selectedText)
    }
  })

  useEffect(() => {
    document.addEventListener('mouseup', e => {
      const {clientX, clientY} = e
      setTimeout(() => {
        setFloatingPosition({clientX, clientY})
      }, 200)
    })
  }, [])

  useEffect(() => {
    const selectedText = selection.text?.trim()

    setTimeout(() => {
      if (autoPopup && isAuth) {
        setOverlayVisible(!!selectedText)
      } else {
        !selectedText && setOverlayVisible(false)
        setFloatingLogoVisible(!!selectedText && !overlayVisible)
      }
    }, 200)
  }, [selection.text, autoPopup, overlayVisible, isAuth])

  useEffect(() => {
    const selectedText = selection.text?.trim()

    if (turboMode && selectedText) {
      setOverlayVisible(true)

      sendToBackground({
        name: MESSAGING_EVENT.INVOKE_ASK_AI,
        body: {selectedText},
      })
    }
  }, [selection.text, turboMode])

  const showOverlay = () => {
    setOverlayVisible(true)
    setTimeout(() => {
      setFloatingLogoVisible(false)
    }, 400)
  }

  const popupURL = chrome?.runtime?.getURL('tabs/prompt-board.html')
  return (
    <section className={`container ${overlayVisible && 'container-visible'}`}>
      {popupURL ? (
        <iframe
          className="iframe"
          src={chrome?.runtime?.getURL('tabs/prompt-board.html')}
          frameBorder="0"
        />
      ) : null}

      {floatingLogoVisible ? (
        <section
          className="floating-logo-container"
          style={{
            left: `${floatingPosition.clientX + 24}px`,
            top: `${floatingPosition.clientY + 24}px`,
          }}
          onMouseOver={showOverlay}
        >
          <img src={Logo} className="floating-logo" />
        </section>
      ) : null}
    </section>
  )
}

export const config = {
  matches: ['<all_urls>'],
}

export const getStyle = () => {
  const style = document.createElement('style')
  style.textContent = cssText

  return style
}

export const mountShadowHost = ({shadowHost, anchor}) => {
  anchor.element.appendChild(shadowHost)
}

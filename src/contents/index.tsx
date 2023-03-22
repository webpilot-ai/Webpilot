import 'rc-tooltip/assets/bootstrap.css'
import cssText from 'data-text:./index.scss'
import Logo from 'data-base64:~assets/icon.png'

import {useEffect, useState} from 'react'
import {sendToBackground} from '@plasmohq/messaging'
import {useMessage} from '@plasmohq/messaging/hook'

import {MESSAGING_EVENT} from '@/config'
import {getSelectedText} from '@/utils'

import useConfig from '@/hooks/use-config'

export default function Index() {
  const [selectedText, setSelectedText] = useState(() => getSelectedText())
  const [overlayVisible, setOverlayVisible] = useState(false)
  const [floatingLogoVisible, setFloatingLogoVisible] = useState(false)
  const [floatingPosition, setFloatingPosition] = useState({clientX: 0, clientY: 0})
  const [iframeHeight, setIFrameHeight] = useState(142)

  const {config} = useConfig()
  const {isAuth, autoPopup, turboMode} = config

  useMessage<number, string>((req, res) => {
    if (req.name === MESSAGING_EVENT.GET_SELECTED_TEXT) {
      const selectedText = getSelectedText()
      res.send(selectedText)
    }

    if (req.name === MESSAGING_EVENT.SYNC_FRAME_HEIGHT) {
      setIFrameHeight(req.body)
    }

    if (req.name === MESSAGING_EVENT.HIDE_OVERLAY) {
      hideOverLay()
      setFloatingLogoVisible(true)
    }
  })

  useEffect(() => {
    window.addEventListener('mouseup', e => {
      const selectedText = getSelectedText()
      setSelectedText(selectedText)

      sendToBackground({
        name: MESSAGING_EVENT.SYNC_SELECTED_TEXT,
        body: selectedText,
      })

      const {clientX, clientY} = e
      setTimeout(() => {
        setFloatingPosition({clientX, clientY})
      }, 200)
    })
  }, [])

  useEffect(() => {
    setTimeout(() => {
      if (autoPopup && isAuth) {
        setOverlayVisible(!!selectedText)
      } else {
        !selectedText && hideOverLay()
        setFloatingLogoVisible(!!selectedText && !overlayVisible)
      }
    }, 200)
  }, [selectedText, autoPopup, overlayVisible, isAuth])

  useEffect(() => {
    if (turboMode && selectedText) {
      setOverlayVisible(true)

      // sendToBackground({
      //   name: MESSAGING_EVENT.INVOKE_ASK_AI,
      //   body: {selectedText},
      // })
    }
  }, [selectedText, turboMode])

  const showOverlay = () => {
    setOverlayVisible(true)
    setTimeout(() => {
      setFloatingLogoVisible(false)
    }, 400)
  }

  const hideOverLay = () => {
    setOverlayVisible(false)
    sendToBackground({name: MESSAGING_EVENT.CLEAN_DATA})
  }

  const popupURL = chrome?.runtime?.getURL('tabs/prompt-board.html')
  return (
    <section
      className={`container ${overlayVisible && 'container-visible'}`}
      style={{
        left: `${floatingPosition.clientX - 225}px`,
        top: `${floatingPosition.clientY + 24}px`,
      }}
    >
      {popupURL ? (
        // FIXME: add fade in out animation
        <iframe
          className="iframe"
          style={{
            display: overlayVisible ? 'block' : 'none',
            height: `${iframeHeight}px`,
            opacity: overlayVisible ? 1 : 0,
          }}
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

import 'rc-tooltip/assets/bootstrap.css'
import cssText from 'data-text:./index.scss'
import Logo from 'data-base64:~assets/icon.png'

import {useCallback, useEffect, useState} from 'react'
import {sendToBackground} from '@plasmohq/messaging'
import {useMessage} from '@plasmohq/messaging/hook'

import {MESSAGING_EVENT, ROUTE} from '@/config'
import {getSelectedText} from '@/utils'

import useConfig from '@/hooks/use-config'

export default function Index() {
  const [selectedText, setSelectedText] = useState(() => getSelectedText())
  const [overlayVisible, setOverlayVisible] = useState(false)
  const [floatingLogoVisible, setFloatingLogoVisible] = useState(false)
  const [floatingPosition, setFloatingPosition] = useState({clientX: 0, clientY: 0})
  const [iframeHeight, setIFrameHeight] = useState(142)
  const [iframeWidth, setIframeWidth] = useState(460)

  const [showInitWindow, setShowInitWindow] = useState(false)

  const {config, setConfig} = useConfig()
  const {isAuth, autoPopup, turboMode} = config

  useMessage<number, string>((req, res) => {
    if (req.name === MESSAGING_EVENT.GET_SELECTED_TEXT) {
      const selectedText = getSelectedText()
      res.send(selectedText)
    }

    if (req.name === MESSAGING_EVENT.SYNC_FRAME_SIZE) {
      const {width, height} = req.body as any
      if (width) setIframeWidth(width)
      if (height) setIFrameHeight(height)
    }

    if (req.name === MESSAGING_EVENT.HIDE_OVERLAY) {
      hideOverLay()
      setFloatingLogoVisible(true)
    }

    if (req.name === MESSAGING_EVENT.EXTNEION_ICON_CLICK) {
      if (!config.isAuth) {
        setShowInitWindow(!showInitWindow)
        setOverlayVisible(!showInitWindow)
      } else {
        // setConfig({
        //   ...config,
        //   latestRoute: ROUTE.PROMOT_ASK_PAGE_PANEL,
        // })
        // setOverlayVisible(true)
      }
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

      if (isAuth) {
        // Set Route to  ROUTE.PROMPT_BOARD_PRESET_PANEL
      }

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
        if (!isAuth) return

        !selectedText && hideOverLay()
        setFloatingLogoVisible(!!selectedText && !overlayVisible)
      }
    }, 200)
  }, [selectedText, autoPopup, overlayVisible, isAuth])

  useEffect(() => {
    if (turboMode && selectedText) {
      setOverlayVisible(true)
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
      className={`container ${overlayVisible && 'container-visible'} ${!isAuth && 'entry'}`}
      style={
        !isAuth
          ? {
              top: '4px',
              right: '25px',
            }
          : {
              left: `${floatingPosition.clientX < 250 ? floatingPosition.clientX : 225}px`,
              top: `${floatingPosition.clientY + 24}px`,
            }
      }
    >
      {popupURL ? (
        <iframe
          className="iframe"
          style={{
            display: overlayVisible ? 'block' : 'none',
            height: `${iframeHeight}px`,
            width: iframeWidth ? `${iframeWidth}px` : null,
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
            left: `${floatingPosition.clientX + 24 < window.innerWidth ? floatingPosition.clientX + 24 : window.innerWidth - 24}px`,
            top: `${floatingPosition.clientY + 24 }px`,
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

import 'rc-tooltip/assets/bootstrap.css'
import cssText from 'data-text:./index.scss'
import Logo from 'data-base64:~assets/icon.png'

import {useEffect, useState} from 'react'
import Draggable from 'react-draggable'
import {sendToBackground} from '@plasmohq/messaging'
import {useMessage} from '@plasmohq/messaging/hook'
import {Readability} from '@mozilla/readability'

import {MESSAGING_EVENT, ROUTE} from '@/config'
import {getSelectedText, getSelectedTextPosition} from '@/utils'

import useConfig from '@/hooks/use-config'

export default function Index() {
  const [selectedText, setSelectedText] = useState(() => getSelectedText())
  const [overlayVisible, setOverlayVisible] = useState(false)
  const [lockOverlay, setLockOverlay] = useState(false)
  const [floatingLogoVisible, setFloatingLogoVisible] = useState(false)

  const [floatingPosition, setFloatingPosition] = useState({clientX: 0, clientY: 0})
  const [iFrameSize, setIframeSize] = useState({
    height: 142,
    width: 460,
  })
  const {config, setConfig} = useConfig()
  const [isAskPage, setIsAskPage] = useState(false)
  const {isAuth, autoPopup, turboMode} = config
  const [dragPosition, setDragPosition] = useState({
    x: 0,
    y: 0,
  })

  useMessage<number, string>((req, res) => {
    if (req.name === MESSAGING_EVENT.GET_SELECTED_TEXT) {
      const selectedText = getSelectedText()
      res.send(selectedText)
      return
    }

    if (req.name === MESSAGING_EVENT.SYNC_FRAME_SIZE) {
      const {width, height} = req.body

      if (width) {
        setIframeSize({
          ...iFrameSize,
          width,
        })
      }
      if (height) {
        setIframeSize({
          ...iFrameSize,
          height,
        })
      }
      return
    }

    if (req.name === MESSAGING_EVENT.CLICK_CLOSE) {
      if (isAskPage) {
        closeAskPage()
      } else {
        setLockOverlay(false)
        setFloatingLogoVisible(true)
      }
      setDragPosition({x: 0, y: 0})

      hideOverLay()

      return
    }

    if (req.name === MESSAGING_EVENT.EXTNEION_ICON_CLICK) {
      if (!config.isAuth) {
        setOverlayVisible(true)
      } else {
        showAskPage()
        setTimeout(() => {
          sendToBackground({name: MESSAGING_EVENT.INPUT_FOCUS})
        }, 100)
      }
      return
    }

    if (req.name === MESSAGING_EVENT.GET_DOCUMENT) {
      let article = {}
      try {
        const cloneNode = document.cloneNode(true)
        article = new Readability(cloneNode).parse()
      } catch (error) {}
      if (article?.textContent) res.send(article.textContent)
    }
  })

  const showAskPage = () => {
    setConfig({
      ...config,
      latestRoute: ROUTE.PROMPT_ASK_PAGE_PANEL,
    })
    setIsAskPage(true)
    setOverlayVisible(true)
    setLockOverlay(true)
  }

  const closeAskPage = () => {
    setConfig({
      ...config,
      latestRoute: ROUTE.PROMPT_BOARD_PRESET_PANEL,
    })
    setIsAskPage(false)
    setLockOverlay(false)
    hideOverLay()
  }

  useEffect(() => {
    const handleMouseUp = e => {
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
    }

    const handleKeyUp = e => {
      // Ctrl + A
      if (e.ctrlKey && e.key === 'a') {
        const selecteText = getSelectedText()
        setSelectedText(selecteText)
        sendToBackground({
          name: MESSAGING_EVENT.SYNC_SELECTED_TEXT,
          body: selecteText,
        })

        const {x, y} = getSelectedTextPosition()

        setTimeout(() => {
          setFloatingLogoVisible(true)
          setFloatingPosition({clientX: x, clientY: y + 10})
        })
      }
    }

    if (lockOverlay) {
      window.removeEventListener('mouseup', handleMouseUp)
    } else {
      window.addEventListener('mouseup', handleMouseUp)
    }

    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keyup', handleKeyUp)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [lockOverlay])

  useEffect(() => {
    if (lockOverlay) return

    setTimeout(() => {
      if (autoPopup && isAuth) {
        setOverlayVisible(!!selectedText)
      } else {
        if (!isAuth) return

        if (isAskPage) {
          setOverlayVisible(true)
        } else {
          // not selected
          !selectedText && hideOverLay()

          setFloatingLogoVisible(!!selectedText && !overlayVisible)
        }
      }
    }, 200)
  }, [selectedText, autoPopup, overlayVisible, isAuth, isAskPage, lockOverlay])

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

  const handleDragStart = () => setLockOverlay(true)

  const handleDragEnd = (e, data) => {
    const {x, y} = data
    setDragPosition({x, y})
  }

  const popupURL = chrome?.runtime?.getURL('tabs/prompt-board.html')
  return (
    <>
      <Draggable
        handle=".drag-handle"
        bounds="html"
        position={dragPosition}
        onStop={handleDragEnd}
        onStart={handleDragStart}
      >
        <section
          className={`container ${overlayVisible && 'container-visible'} ${!isAuth && 'entry'}`}
          style={
            !isAuth
              ? {
                  top: '4px',
                  right: '25px',
                }
              : isAskPage
              ? {
                  top: (window.innerHeight - 131) / 2 - 80,
                  left: (window.innerWidth - 460) / 2,
                }
              : {
                  left: `${floatingPosition.clientX < 250 ? floatingPosition.clientX : 225}px`,
                  top: `${floatingPosition.clientY + 24}px`,
                }
          }
        >
          <section className="drag-handle" />
          {popupURL ? (
            <iframe
              className="iframe"
              style={{
                display: overlayVisible ? 'block' : 'none',
                height: `${iFrameSize.height}px`,
                width: iFrameSize.width ? `${iFrameSize.width}px` : null,
                opacity: overlayVisible ? 1 : 0,
              }}
              src={chrome?.runtime?.getURL('tabs/prompt-board.html')}
              frameBorder="0"
            />
          ) : null}
        </section>
      </Draggable>
      {floatingLogoVisible ? (
        <section
          className="floating-logo-container"
          style={{
            left: `${
              floatingPosition.clientX + 24 < window.innerWidth
                ? floatingPosition.clientX + 24
                : window.innerWidth - 24
            }px`,
            top: `${floatingPosition.clientY + 24}px`,
          }}
          onMouseOver={showOverlay}
        >
          <img src={Logo} className="floating-logo" />
        </section>
      ) : null}
    </>
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

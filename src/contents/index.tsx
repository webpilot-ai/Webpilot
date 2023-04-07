import 'rc-tooltip/assets/bootstrap.css'
import cssText from 'data-text:./index.scss'
import Logo from 'data-base64:~assets/icon.png'

import {useCallback, useEffect, useState} from 'react'
import Draggable from 'react-draggable'
import {sendToBackground} from '@plasmohq/messaging'
import {useMessage} from '@plasmohq/messaging/hook'
import {Readability} from '@mozilla/readability'

import {MESSAGING_EVENT, ROUTE} from '@/config'
import {getSelectedText, getSelectedTextPosition} from '@/utils'

import useConfig from '@/hooks/use-config'

const LOGO_WIDTH = 24
const LOGO_HEIGHT = 24

const FRAME_WIDTH = 460
const FRAME_HEIGHT = 141

export default function Index() {
  const [selectedText, setSelectedText] = useState(() => getSelectedText())
  const [overlayVisible, setOverlayVisible] = useState(false)
  const [lockOverlay, setLockOverlay] = useState(false)
  const [floatingLogoVisible, setFloatingLogoVisible] = useState(false)

  const {config, setConfig} = useConfig()
  const [isAskPage, setIsAskPage] = useState(false)
  const {isAuth, autoPopup, turboMode} = config
  const [mousePosition, setMousePosition] = useState({x: 0, y: 0})
  const [logoPosition, setLogoPosition] = useState({x: 0, y: 0})
  const [framePosition, setFramePosition] = useState({x: 0, y: 0})
  const [iFrameSize, setIframeSize] = useState({
    height: 142,
    width: 460,
  })
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
        if (isAskPage) {
          closeAskPage()
        } else {
          showAskPage()
          setTimeout(() => {
            sendToBackground({name: MESSAGING_EVENT.INPUT_FOCUS})
          }, 100)
        }
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
    setScrollY(0)
    setScrollYOffset(0)
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
        setMousePosition({x: clientX, y: clientY})
      }, 200)
    }

    const handleKeyUp = e => {
      // Ctrl + A or Ctrl + left/right/up/down
      if (
        (e.ctrlKey && e.key === 'a') ||
        (e.shiftKey &&
          (e.keyCode === 37 || e.keyCode === 38 || e.keyCode === 39 || e.keyCode === 40))
      ) {
        const selecteText = getSelectedText()
        setSelectedText(selecteText)
        sendToBackground({
          name: MESSAGING_EVENT.SYNC_SELECTED_TEXT,
          body: selecteText,
        })

        const {x, y} = getSelectedTextPosition()

        setTimeout(() => {
          setFloatingLogoVisible(true)
          setMousePosition({x, y})
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
          setScrollY(0)
          setScrollYOffset(0)
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

      sendToBackground({name: MESSAGING_EVENT.INPUT_FOCUS})
    }, 400)
  }

  const hideOverLay = () => {
    setOverlayVisible(false)
    sendToBackground({name: MESSAGING_EVENT.CLEAN_DATA})
  }

  const handleDragStart = () => {
    setLockOverlay(true)
  }

  const handleDragEnd = (e, data) => {
    const {x, y} = data
    setScrollYOffset(0)
    setDragPosition({x, y})
  }

  /**
   * calculatr logo position
   */
  useEffect(() => {
    if (floatingLogoVisible) {
      const LOGO_OFFSET = {
        x: 10,
        y: 20,
      }

      let {x, y} = mousePosition

      // left edge
      x = x < LOGO_WIDTH ? LOGO_WIDTH + LOGO_OFFSET.x : x
      // right edge
      x = window.innerWidth - x < LOGO_WIDTH ? window.innerWidth - LOGO_WIDTH - LOGO_OFFSET.x : x
      // bottom
      if (window.innerHeight - y < LOGO_HEIGHT + LOGO_OFFSET.y) {
        y = window.innerHeight - (LOGO_WIDTH + LOGO_OFFSET.y)

        // avoid popup active at the same time
        x = x + 24 < window.innerWidth - LOGO_WIDTH ? x + 24 : x - 24
      }

      y =
        window.innerHeight - y < LOGO_HEIGHT + LOGO_OFFSET.y
          ? window.innerHeight - (LOGO_WIDTH + LOGO_OFFSET.y)
          : y + LOGO_OFFSET.y

      setLogoPosition({x, y})
    }
  }, [mousePosition, floatingLogoVisible])

  const [scrollY, setScrollY] = useState(0)
  const [scrollYOffset, setScrollYOffset] = useState(0)

  const handleScroll = useCallback(() => {
    if (!isAskPage) {
      setScrollYOffset(scrollY - window.scrollY)
    }
  }, [scrollY, isAskPage])

  /**
   * listen scroll
   */
  useEffect(() => {
    if (floatingLogoVisible || overlayVisible) {
      setScrollY(window.scrollY)
      window.addEventListener('scroll', handleScroll)
    } else {
      window.removeEventListener('scroll', handleScroll)
    }

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [floatingLogoVisible, overlayVisible, handleScroll])

  /**
   * calculatr frame position
   */
  useEffect(() => {
    const EDGE_OFFEST = 25
    const FRMAE_OFFSET = {
      y: 20,
    }
    if (overlayVisible) {
      let {x, y} = mousePosition

      if (window.innerWidth > FRAME_WIDTH + EDGE_OFFEST) {
        // left edge
        x = x < EDGE_OFFEST ? EDGE_OFFEST : x
        // right edeg
        const xMax = window.innerWidth - (FRAME_WIDTH + EDGE_OFFEST)
        x = x <= xMax ? x : xMax
      } else {
        x = window.innerWidth / 2
      }

      y =
        window.innerHeight - y < FRAME_HEIGHT + EDGE_OFFEST + FRMAE_OFFSET.y
          ? window.innerHeight - (FRAME_HEIGHT + EDGE_OFFEST + FRMAE_OFFSET.y)
          : y + FRMAE_OFFSET.y

      setFramePosition({x, y})
    }
  }, [mousePosition, overlayVisible])

  const popupURL = chrome?.runtime?.getURL('tabs/prompt-board.html')
  return (
    <>
      <Draggable
        handle=".drag-handle"
        bounds="html"
        position={{
          x: dragPosition.x,
          y: dragPosition.y + scrollYOffset,
        }}
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
                  left: `${framePosition.x}px`,
                  top: `${framePosition.y}px`,
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
            left: `${logoPosition.x}px`,
            top: `${logoPosition.y}px`,
            transform: `translate(0px, ${scrollYOffset}px)`,
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

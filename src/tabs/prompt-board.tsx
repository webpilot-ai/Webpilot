import {useEffect, useRef} from 'react'

import '@assets/styles/base.scss'
import 'react-toastify/dist/ReactToastify.css'

import {ToastContainer} from 'react-toastify'
import css from 'styled-jsx/css'
import {sendToContentScript} from '@plasmohq/messaging'

import {withAIContext} from '@/components/with-ai-context'
import {MESSAGING_EVENT, ROUTE} from '@/config'
import useConfig from '@/hooks/use-config'

import EntryPanel from './prompt-board/entry-panel'
import PresetPanel from './prompt-board/preset-panel'
import AskPage from './prompt-board/ask-page'

const PANEL = {
  [ROUTE.PROMPT_BOARD_ENTRY_PANEL]: EntryPanel,
  [ROUTE.PROMPT_BOARD_PRESET_PANEL]: PresetPanel,
  // [ROUTE.PROMPT_BOARD_CUSTOM_PANEL]: CustomPanel,
  [ROUTE.PROMOT_ASK_PAGE_PANEL]: AskPage,
}

export default withAIContext(function Index() {
  const {config} = useConfig()

  const Panel = PANEL[config.latestRoute]

  const elementRef = useRef()

  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      const currentHeight = elementRef.current?.clientHeight
      const currentWIdth = elementRef.current?.clientWidth

      console.log(currentWIdth, ' - ', currentHeight)

      sendToContentScript({
        name: MESSAGING_EVENT.SYNC_FRAME_SIZE,
        body: {
          width: currentWIdth,
          height: currentHeight,
        },
      })
    })

    resizeObserver.observe(elementRef.current)
    return () => {
      resizeObserver.disconnect()
    }
  }, [])

  return (
    <div className="container" ref={elementRef}>
      <Panel />
      <ToastContainer limit={1} />
      <style jsx>{styles}</style>
      <style jsx global>
        {globalStyles}
      </style>
    </div>
  )
})

const styles = css`
  .container {
    position: relative;
    width: 100%;
    transition: all 0.5;
  }
`

const globalStyles = css.global`
  .svg-icon:hover * {
    fill: #000;
  }
`

import {useEffect, useState} from 'react'
// import {createRoot} from 'react-dom/client'
import cssText from 'data-text:./tweet-button.css'
import {PlasmoContentScript, PlasmoGetOverlayAnchor} from 'plasmo'

import {askOpenAI} from '@/io'
import useConfig from '@/hooks/use-config'

export const config: PlasmoContentScript = {
  matches: ['https://twitter.com/*'],
}

export const getOverlayAnchor: PlasmoGetOverlayAnchor = () =>
  document.querySelector('.DraftEditor-editorContainer')

const PlasmoOverlay = () => {
  const overlayAnchor = document.querySelector('.DraftEditor-editorContainer')
  const [overlaySize, setOverlaySize] = useState({width: 0, height: 0})
  useEffect(() => {
    const handleResize = () => {
      const {width, height} = overlayAnchor.getBoundingClientRect()
      setOverlaySize({width, height})
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [overlayAnchor])
  return (
    <div
      id="fluentify"
      style={{
        position: 'absolute',
        width: overlaySize.width,
        height: overlaySize.height,
        zIndex: 'auto',
        pointerEvents: 'none',
      }}
    >
      <InjectButton />
    </div>
  )
}

export default PlasmoOverlay

// export const getRootContainer = () =>
//   new Promise(resolve => {
//     const $parent = document.querySelector('.DraftEditor-editorContainer')
//
//     if ($parent) {
//       const $rootContainer = document.createElement('fluentify-extension')
//       $parent.appendChild($rootContainer)
//       resolve($rootContainer)
//     }
//   })
//

function InjectButton() {
  const [loading, setLoading] = useState(false)

  const {config} = useConfig()
  const {authKey, model} = config

  useEffect(() => {
    const $placeholder = getTwitterHomePlaceHolder()
    $placeholder.textContent = "What's happening with Fluentify?"
  }, [])

  const handelClick = () => {
    const {value} = getTextarea()
    setLoading(true)

    askOpenAI({authKey, model, prompt: value})
      .then(res => {
        const $textarea = getTextarea()
        if (res) {
          $textarea.value += `\n\n`
          $textarea.value += res
        }
      })
      .catch(err => {
        alert(err?.response?.data?.error?.message || err.message)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <div
      className="tweet-button"
      onClick={handelClick}
      style={{
        position: 'absolute',
        top: '50%',
        right: 0,
        pointerEvents: 'all',
        transform: 'translate(0%, -50%)',
      }}
    >
      {loading ? 'loading...' : 'Fluentify'}
    </div>
  )
}

function getTextarea() {
  const $textarea = document.querySelector('div[data-testid="tweetTextarea_0"]')
  return $textarea
}

function getTwitterHomePlaceHolder() {
  const $placeholder = document.querySelector('.public-DraftEditorPlaceholder-inner')
  return $placeholder
}

export const getStyle = () => {
  const style = document.createElement('style')
  style.textContent = cssText
  return style
}

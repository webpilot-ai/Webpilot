import '@assets/styles/base.scss'
import 'react-toastify/dist/ReactToastify.css'

import {useState} from 'react'
import {ToastContainer} from 'react-toastify'
import Modal from 'rc-dialog/es'
import css from 'styled-jsx/css'

import {defaultConfig} from '@/config'
import {gettext, toast} from '@/utils'

import useConfig from '@/hooks/use-config'

import Button, {BUTTON_TYPE} from '@/components/button'
import {withAIContext} from '@/components/with-ai-context'

// import ModelSettings from './model-settings'
import PromptSetting from './prompt-setting'
import PromptAdd from './prompt-add'

import LogoTextIcon from 'react:@assets/images/Text+Logo.svg'

export default withAIContext(function Options() {
  const {config, setConfig} = useConfig()
  const {prompts} = config

  const [activeTabIndex, setActiveTabIndex] = useState(0)
  const [resetModalVisible, setResetModalVisible] = useState(false)

  const toggleResetModalVisible = () => setResetModalVisible(!resetModalVisible)

  const resetDefaultConfig = () => {
    setConfig(defaultConfig)
    toggleResetModalVisible()
    toast.success(gettext('Restored to default settings'))
  }

  const handlePromptChange = (newPrompt, index) => {
    prompts[index] = newPrompt
    setConfig({
      ...config,
      prompts,
    })
  }

  const handleAddNewPrompt = () => {
    setConfig({
      ...config,
      prompts: [
        ...config.prompts,
        {
          title: '',
          command: '',
        },
      ],
    })
  }

  const handleDeletePrompt = (index: number) => {
    prompts.splice(index, 1)
    setConfig({
      ...config,
      prompts,
    })
  }

  const handleMove = (direction: 'up' | 'down', index: number) => {
    if (direction === 'up') {
      if (index <= 0) return
      prompts.splice(index - 1, 0, prompts.splice(index, 1)[0])
    } else if (direction === 'down') {
      if (index === prompts.length) return
      prompts.splice(index + 1, 0, prompts.splice(index, 1)[0])
    }

    setConfig({
      ...config,
      prompts,
    })
  }
  return (
    <section className="container">
      <section className="body">
        <main>
          <section className="header">
            <LogoTextIcon />
            <span className="slogan">Opensource | AI Assistant on All Websites</span>
          </section>
          <section className="tabs">
            <section className="tab">Prompts</section>
          </section>

          <section className="prompts">
            {prompts.map((item, index) => {
              return (
                <PromptSetting
                  key={index}
                  prompt={item}
                  onMoveUp={() => handleMove('up', index)}
                  onMoveDown={() => handleMove('down', index)}
                  onChange={p => handlePromptChange(p, index)}
                  onDelete={() => handleDeletePrompt(index)}
                />
              )
            })}
          </section>
          {prompts.length >= 4 ? null : <PromptAdd onClick={handleAddNewPrompt} />}
        </main>
        <footer>
          <span>Webpilot is open source</span>
          <a href="https://github.com/Fluentify-IO/Fluentify" target="blank">
            Star on Github
          </a>
        </footer>
      </section>

      <style jsx>{styles}</style>
      <style jsx global>
        {globalStyles}
      </style>
    </section>
  )
})

const styles = css`
  .container {
    width: 100%;
    height: 100vh;
    display: flex;
    align-items: flex-end;
    justify-content: center;
  }

  .body {
    max-width: 1438px;
    width: calc(100vw - 18px);
    height: calc(100vh - 18px);
    padding: 24px 16px;
    background: rgba(255, 255, 255, 0.6);
    border: 1px solid #ffffff;
    border-radius: 20px 20px 0px 0px;

    display: flex;
    flex-direction: column;
    overflow-y: scroll;

    &::-webkit-scrollbar {
      width: 4px;
    }
    &::-webkit-scrollbar-thumb {
      /* margin: 16px 0px;
      max-height: 32px;
      background-color: white; */
    }
    &::-webkit-scrollbar-button {
      display: none;
    }

    main {
      flex: 1;
    }

    .header {
      color: #777;
      font-size: 24px;
      line-height: 28px;
      display: flex;
      align-items: flex-end;

      .slogan {
        margin-left: 43px;
      }
    }

    footer {
      margin-top: 32px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-size: 16px;

      a {
        font-weight: bold;
        color: #4f5aff;
      }
    }
  }

  .tabs {
    margin-top: 50px;
    height: 34px;
    padding: 0px 12px;

    .tab {
      font-size: 24px;
      font-color: #000000;
      position: relative;

      &::after {
        content: '';
        display: block;
        width: 100px;
        height: 4px;
        background-color: #4128d3;
        position: absolute;

        border-radius: 2px;
      }
    }
  }

  .prompts {
    margin-top: 36px;
  }

  @media (max-width: 820px) {
    .slogan {
      display: none;
    }
  }
`

const globalStyles = css.global`
  body {
    width: 100%;
    height: 100vh;
    background: linear-gradient(150.76deg, #efdaff 12.93%, #b28aff 64.87%, #6f63ff 108.73%);
  }

  .prompt-item + .prompt-item {
    margin-top: 16px;
  }
`

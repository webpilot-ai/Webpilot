import '@assets/styles/base.scss'
import 'react-toastify/dist/ReactToastify.css'

import {useEffect, useState} from 'react'
import {ToastContainer} from 'react-toastify'
import Modal from 'rc-dialog/es'
import css from 'styled-jsx/css'

import {defaultConfig} from '@/config'
import {gettext, toast} from '@/utils'

import useConfig from '@/hooks/use-config'
import Button, {BUTTON_TYPE} from '@/components/button'
import {withAIContext} from '@/components/with-ai-context'

import PromptSettings from './prompt-settings'
import ModelSettings from './model-settings'

export default withAIContext(function Options() {
  const [activeTabIndex, setActiveTabIndex] = useState(0)
  const [resetModalVisible, setResetModalVisible] = useState(false)
  const {config, setConfig} = useConfig()

  const {prompts} = config

  useEffect(() => {
    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
      sendResponse('')
    })
  })

  const toggleResetModalVisible = () => setResetModalVisible(!resetModalVisible)

  const resetDefaultConfig = () => {
    setConfig(defaultConfig)
    toggleResetModalVisible()
    toast.success(gettext('Restored to default settings'))
  }

  return (
    <section className="container">
      <h1 className="title">Fluentify</h1>

      <section className="body">
        <section className="tabs">
          <section>
            {prompts.map((prompt, index) => (
              <div key={index} className="tab">
                <Button
                  border
                  text={prompt.title}
                  selected={activeTabIndex === index}
                  onClick={() => setActiveTabIndex(index)}
                />
              </div>
            ))}
          </section>

          <section>
            <div className="tab">
              <Button
                border
                text={gettext('Parameter')}
                selected={activeTabIndex === prompts.length}
                onClick={() => setActiveTabIndex(prompts.length)}
              />
            </div>

            <div className="reset" onClick={toggleResetModalVisible}>
              {gettext('Restore default settings')}
            </div>
          </section>
        </section>

        <section className="panel">
          {activeTabIndex < prompts.length ? (
            <PromptSettings prompt={prompts[activeTabIndex]} promptIndex={activeTabIndex} />
          ) : null}

          {activeTabIndex === prompts.length ? <ModelSettings /> : null}
        </section>
      </section>
      <ToastContainer limit={1} />

      <Modal
        title={gettext('Tips')}
        visible={resetModalVisible}
        style={{marginTop: '300px'}}
        onClose={toggleResetModalVisible}
        footer={
          <section className="modal-footer">
            <div className="cancel">
              <Button border text={gettext('Dismiss')} onClick={toggleResetModalVisible} />
            </div>
            <div className="confirm">
              <Button
                border
                type={BUTTON_TYPE.PRIMARY}
                text={gettext('Confirm')}
                onClick={resetDefaultConfig}
              />
            </div>
          </section>
        }
      >
        <div className="modal-body">
          {gettext('About to clear the auth key and restore all preset functions')}
        </div>
      </Modal>

      <style jsx>{styles}</style>
      <style jsx global>
        {globalStyles}
      </style>
    </section>
  )
})

const styles = css`
  .container {
    width: 620px;
    margin: 0 auto;
  }

  .title {
    margin: 30px 0;
    color: #000;
    font-weight: 600;
    font-size: 36px;
    line-height: 50px;
    text-align: center;
  }

  .body {
    display: flex;
    justify-content: space-between;
  }

  .tabs {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 160px;
    margin-top: 40px;
  }

  .tab {
    margin-bottom: 20px;
  }

  .panel {
    width: 400px;
  }

  .reset {
    margin-top: 12px;
    color: #a6a6a6;
    text-align: center;
    cursor: pointer;

    &:hover {
      color: #7d7d7d;
    }
  }

  .modal-body {
    color: #000;
    font-size: 16px;
    line-height: 40px;
  }

  .modal-footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;

    .cancel,
    .confirm {
      width: 80px;
    }

    .confirm {
      margin-left: 24px;
    }
  }
`

const globalStyles = css.global`
  body {
    padding-bottom: 80px;
    background-color: #f7f3ea;
  }
`

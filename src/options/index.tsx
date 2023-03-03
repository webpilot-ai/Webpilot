import style from './style.module.scss'
import 'react-toastify/dist/ReactToastify.css'

import {useEffect, useState} from 'react'
import {ToastContainer} from 'react-toastify'
import Modal from 'rc-dialog/es'

import {defaultConfig} from '@/config'
import {gettext, toast} from '@/utils'

import useConfig from '@/hooks/use-config'
import Button, {BUTTON_TYPE} from '@/components/button'
import {withAIContext} from '@/components/with-ai-context'

import PromptPanel from './prompt-panel'
import ModelPanel from './model-panel'

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
    <section className={style.container}>
      <h1 className={style.title}>Fluentify</h1>

      <section className={style.body}>
        <section className={style.tabs}>
          <section>
            {prompts.map((prompt, index) => (
              <div key={index} className={style.tab}>
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
            <div className={style.tab}>
              <Button
                border
                text={gettext('Parameter')}
                selected={activeTabIndex === prompts.length}
                onClick={() => setActiveTabIndex(prompts.length)}
              />
            </div>

            <div className={style.reset} onClick={toggleResetModalVisible}>
              {gettext('Restore default settings')}
            </div>
          </section>
        </section>

        <section className={style.panel}>
          {activeTabIndex < prompts.length ? (
            <PromptPanel prompt={prompts[activeTabIndex]} promptIndex={activeTabIndex} />
          ) : null}

          {activeTabIndex === prompts.length ? <ModelPanel /> : null}
        </section>
      </section>
      <ToastContainer />

      <Modal
        title={gettext('Tips')}
        visible={resetModalVisible}
        style={{marginTop: '300px'}}
        onClose={toggleResetModalVisible}
        footer={
          <section className={style.modalFooter}>
            <div className={style.cancel}>
              <Button border text={gettext('Dismiss')} onClick={toggleResetModalVisible} />
            </div>
            <div className={style.confirm}>
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
        <div className={style.modalBody}>
          {gettext('About to clear the auth key and restore all preset functions')}
        </div>
      </Modal>
    </section>
  )
})

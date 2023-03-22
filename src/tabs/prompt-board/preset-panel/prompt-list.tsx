import RadioIcon from 'react:@assets/images/radio.svg'
import RadioCheckedIcon from 'react:@assets/images/radio-checked.svg'

import {useState} from 'react'
import copyToClipboard from 'copy-to-clipboard'
import {useMessage} from '@plasmohq/messaging/hook'
import css from 'styled-jsx/css'

import {defaultConfig, MESSAGING_EVENT, Prompt, ROUTE} from '@/config'
import {gettext, toast} from '@/utils'

import useConfig from '@/hooks/use-config'
import useAI from '@/hooks/use-ai'

import Button from '@/components/button'

export default function PromptList({
  onSelect = (prompt: Prompt) => null,
  selectIndex = -1,
  updateIndex = index => null,
}) {
  const {config, setConfig} = useConfig()
  const {ai} = useAI()

  const prompts = config.prompts || defaultConfig.prompts

  const selectPrompt = index => {
    updateIndex(index)
    setConfig({...config, latestPresetPromptIndex: index})
    onSelect(prompts[index])
  }

  return (
    <section className="prompt-list">
      {prompts.map((prompt, index) => (
        <div key={index} className="item">
          <Button
            text={prompt.title}
            disabled={ai?.loading}
            selected={index === selectIndex}
            onClick={() => selectPrompt(index)}
          />
        </div>
      ))}
      <style jsx>{styles}</style>
    </section>
  )
}

const styles = css`
  .prompt-list {
    display: flex;
    flex-wrap: wrap;
    margin-top: 8px;
  }

  .item {
    & + .item {
      margin-left: 10px;
    }
  }

  .custom {
    width: 100%;
    text-align: left;
  }
`

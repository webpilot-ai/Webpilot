import css from 'styled-jsx/css'

import {defaultConfig} from '@/config'

import useConfig from '@/hooks/use-config'
import useAI from '@/hooks/use-ai'

import Button from '@/components/button'

export default function PromptList({
  onSelect = () => null,
  selectIndex = -1,
  updateIndex = () => null,
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
      margin-left: 8px;
    }

    button {
      padding: 4px 8px;
      color: #4f5aff;
      font-weight: 500;
      font-size: 12px;
      line-height: 17px;
    }
  }

  .custom {
    width: 100%;
    text-align: left;
  }
`

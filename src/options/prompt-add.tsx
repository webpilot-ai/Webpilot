import css from 'styled-jsx/css'

import AddIcon from 'react:@assets/images/control-add.svg'

export default function PromptAdd({onClick = () => null}) {
  return (
    <section className="new-prompt" onClick={onClick}>
      <AddIcon />
      <span className="add-label">Add New Prompt</span>
      <style jsx>{styles}</style>
    </section>
  )
}

const styles = css`
  .new-prompt {
    display: flex;
    align-items: center;
    width: 100%;
    margin-top: 16px;
    padding: 15px 20px 14px;
    color: #777;
    font-size: 16px;
    background-color: #fff;
    border-radius: 10px;
    cursor: pointer;
    user-select: none;

    &:hover {
      filter: drop-shadow(0 8px 24px rgb(149 157 165 / 20%));
    }

    &:active {
      filter: brightness(0.99);
    }

    .add-label {
      margin-left: 17px;
    }
  }
`

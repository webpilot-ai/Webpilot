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
    margin-top: 16px;
    width: 100%;
    background-color: #ffffff;
    border-radius: 10px;
    padding: 15px 20px 14px 20px;
    font-size: 16px;
    color: #777777;
    cursor: pointer;
    user-select: none;
    display: flex;
    align-items: center;

    &:hover {
      filter: drop-shadow(0px 8px 24px rgba(149, 157, 165, 0.2));
    }

    &:active {
      filter: brightness(0.99);
    }

    .add-label {
      margin-left: 17px;
    }
  }
`

import css from 'styled-jsx/css'

export default function SelectedPreview({selectedText = ''}) {
  return (
    <p className="preview">
      With the select conntet "<span className="selected-text">{selectedText}</span>", what do you
      want?
      <style jsx> {styles}</style>
    </p>
  )
}

const styles = css`
  .preview {
    font-size: 12px;
    line-height: 17px;
    margin-top: 13px;
    color: #777;

    display: flex;
    align-items: flex-end;
    .selected-text {
      display: inline-block;
      max-width: 100px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
`

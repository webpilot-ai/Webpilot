import css from 'styled-jsx/css'

import Button from './button'

export const ReferenceType = {
  NONE: 'NONE',
  THE_SELECT: 'THE_SELECT',
  THIS_PAGE: 'THIS_PAGE',
}

export default function ReferenceBtnGroup({
  type = ReferenceType.NONE,
  disabled = false,
  onChange = type => null,
}) {
  return (
    <section className="reference-btn-group">
      <span>Reference:</span>
      <ul role="list" className="btn-list">
        <li>
          <Button
            disabled={disabled}
            active={type === ReferenceType.NONE}
            onClick={() => onChange(ReferenceType.NONE)}
          >
            None
          </Button>
        </li>
        <li>
          <Button
            disabled={disabled}
            active={type === ReferenceType.THE_SELECT}
            onClick={() => onChange(ReferenceType.THE_SELECT)}
          >
            The Select
          </Button>
        </li>
        <li>
          <Button
            disabled={disabled}
            active={type === ReferenceType.THIS_PAGE}
            onClick={() => onChange(ReferenceType.THIS_PAGE)}
          >
            This Page
          </Button>
        </li>
      </ul>
      <style jsx>{styles}</style>
    </section>
  )
}

const styles = css`
  .reference-btn-group {
    margin: 8px 0px;
    font-weight: 500;
    font-size: 12px;
    line-height: 17px;
    color: #929497;
    display: flex;
    align-items: center;

    .btn-list {
      margin: 0px;
      padding: 0px;
      display: flex;
      margin-left: 8px;

      li + li {
        margin-left: 8px;
      }
    }
  }
`

import css from 'styled-jsx/css'

import Button from './button'

export const ReferenceType = {
  NONE: 'NONE',
  THE_SELECT: 'THE_SELECT',
  THIS_PAGE: 'THIS_PAGE',
}

export default function ReferenceBtnGroup({
  type = ReferenceType.THIS_PAGE,
  disabled = false,
  onChange = () => null,
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
    display: flex;
    align-items: center;
    margin: 8px 0;
    color: #929497;
    font-weight: 500;
    font-size: 12px;
    line-height: 17px;

    .btn-list {
      display: flex;
      margin: 0;
      margin-left: 8px;
      padding: 0;

      li + li {
        margin-left: 8px;
      }
    }
  }
`

import css from 'styled-jsx/css'

import {gettext} from '@/utils'

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
      <span>{gettext('Reference:')}</span>
      <ul role="list" className="btn-list">
        <li>
          <Button
            disabled={disabled}
            active={type === ReferenceType.NONE}
            onClick={() => onChange(ReferenceType.NONE)}
            height="25px"
          >
            {gettext('None')}
          </Button>
        </li>
        <li>
          <Button
            disabled={disabled}
            active={type === ReferenceType.THE_SELECT}
            onClick={() => onChange(ReferenceType.THE_SELECT)}
            height="25px"
          >
            {gettext('The Select')}
          </Button>
        </li>
        <li>
          <Button
            disabled={disabled}
            active={type === ReferenceType.THIS_PAGE}
            onClick={() => onChange(ReferenceType.THIS_PAGE)}
            height="25px"
          >
            {gettext('This Page')}
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

      button {
        height: 25px;
        padding: 4px 8px;
      }

      li + li {
        margin-left: 8px;
      }
    }
  }
`

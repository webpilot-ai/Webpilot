import {useEffect, useState} from 'react'
import css from 'styled-jsx/css'

import Button from './button'

export const enum ReferenceType {
  NONE = 'NONE',
  THE_SELECT = 'THE_SELECT',
  THIS_PAGE = 'THIS_PAGE',
}

interface PropsType {
  parentType?: ReferenceType
  disabled?: boolean
  onTypeChange?: (bnt: ReferenceType) => void
}

export default function ReferenceBtnGroup({parentType, disabled, onTypeChange}: PropsType) {
  const [type, setType] = useState<ReferenceType>(parentType)

  useEffect(() => {
    if (!parentType) {
      setType(ReferenceType.NONE)
    } else {
      setType(parentType)
    }
  }, [parentType])

  const handleClickBtn = (btn: ReferenceType) => {
    if (btn === type) return

    setType(btn)
    onTypeChange(btn)
  }

  return (
    <section className="reference-btn-group">
      <span>Reference:</span>
      <ul role="list" className="btn-list">
        <li>
          <Button
            disabled={disabled}
            active={type === ReferenceType.NONE}
            onClick={() => handleClickBtn(ReferenceType.NONE)}
          >
            None
          </Button>
        </li>
        <li>
          <Button
            disabled={disabled}
            active={type === ReferenceType.THE_SELECT}
            onClick={() => handleClickBtn(ReferenceType.THE_SELECT)}
          >
            The Select
          </Button>
        </li>
        <li>
          <Button
            disabled={disabled}
            active={type === ReferenceType.THIS_PAGE}
            onClick={() => handleClickBtn(ReferenceType.THIS_PAGE)}
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

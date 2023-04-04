import {useCallback, useEffect, useRef, useState} from 'react'
import css from 'styled-jsx/css'

import PencilIcon from 'react:@assets/images/pencil.svg'
import DeleteFilledIcon from 'react:@assets/images/delete-filled.svg'
import DeleteOutlineIcon from 'react:@assets/images/delete-outline.svg'
import UpIcon from 'react:@assets/images/up.svg'
import DownIcon from 'react:@assets/images/down.svg'

export default function PromptSettings({
  prompt = {},
  onChange = () => undefined,
  onDelete = () => null,
  onMoveUp = () => null,
  onMoveDown = () => null,
}) {
  const [promptInfo, setpromptInfo] = useState(prompt)

  const [isEditing, setIsEditing] = useState(false)

  const itemRef = useRef<HTMLElement>()
  const teatareaRef = useRef<HTMLTextAreaElement>()

  useEffect(() => {
    setpromptInfo(prompt)
    updateTextArea()
  }, [prompt])

  const handleClickOutside = useCallback(event => {
    if (itemRef && !itemRef.current.contains(event.target)) {
      document.removeEventListener('mouseup', handleClickOutside)
      setIsEditing(false)
    }
  }, [])

  const triggerEditing = () => {
    setIsEditing(true)
    document.addEventListener('mouseup', handleClickOutside)
  }

  useEffect(() => {
    if (isEditing) {
      document.addEventListener('mouseup', handleClickOutside)
    } else {
      document.removeEventListener('mouseup', handleClickOutside)
    }
  }, [isEditing, handleClickOutside])

  const handleTitleChange = e => {
    setpromptInfo({...promptInfo, title: e.target.value})
  }

  const handleCommandChange = e => {
    setpromptInfo({...promptInfo, command: e.target.value})
    updateTextArea()
  }

  const updateChange = () => {
    if (JSON.stringify(promptInfo) !== JSON.stringify(prompt)) onChange(promptInfo)
  }

  const updateTextArea = () => {
    // FIXME: hack here, replace with editable element
    setTimeout(() => {
      teatareaRef.current.style.cssText = 'height: auto; padding 0px;'
      teatareaRef.current.style.cssText = `height: ${
        teatareaRef.current.scrollHeight <= 50 ? 36 : teatareaRef.current.scrollHeight + 4
      }px`
    }, 30)
  }

  return (
    <section className={`prompt-item ${isEditing && 'prompt-item--shaodw'}`} ref={itemRef}>
      <section className="title">
        {isEditing ? (
          <input
            className="title-input"
            onBlur={updateChange}
            value={promptInfo.title}
            onChange={handleTitleChange}
          />
        ) : (
          <span className="show-title">{promptInfo.title}</span>
        )}

        <div className="icon-wrap">
          {isEditing ? null : <PencilIcon className="edit-icon" onClick={triggerEditing} />}
        </div>
      </section>
      <section className="content">
        {/* Change to ediable element may better */}
        <textarea
          ref={teatareaRef}
          onBlur={updateChange}
          value={promptInfo.command}
          onChange={handleCommandChange}
          className={`prompt-input ${!isEditing && 'disalbed'}`}
          disabled={!isEditing}
        />
      </section>
      <section className="placerholder">

      </section>
      {isEditing ? null: (
        <section className="btn-group">
          <section className="btn move-up" onClick={onMoveDown}>
            <DownIcon />
          </section>
          <section className="btn move-up" onClick={onMoveUp}>
            <UpIcon />
          </section>
          <section className="btn delete-icon" onClick={onDelete}>
            <DeleteFilledIcon className="del-btn-filled" />
            <DeleteOutlineIcon className="del-btn-outline" />
          </section>
        </section>
      )}
      <style jsx>{styles}</style>
      <style jsx>{globalCss}</style>
    </section>
  )
}

const styles = css`
  .prompt-item {
    padding: 16px;
    background-color: #fff;
    border-radius: 10px;
    transition: all 0.3s;

    &.prompt-item--shaodw {
      filter: drop-shadow(0 8px 24px rgb(149 157 165 / 20%));
    }

    .title {
      display: flex;
      align-items: center;
      color: #000;
      font-weight: 400;
      font-size: 18px;
      line-height: 25px;

      .show-title {
        max-width: 180px;
        padding-left: 3px;
        overflow: hidden;
        line-height: 30px;
        text-overflow: ellipsis;
      }

      .title-input {
        height: 30px;
        border: 1px solid #dadada;
        border-radius: 4px;

        &:focus-visible {
          outline: none;
        }
      }

      .icon-wrap {
        display: none;
      }
    }

    .content {
      margin-top: 8px;

      .prompt-input {
        width: 100%;
        min-width: 100%;
        max-width: 100%;
        height: auto;
        padding: 4px;
        color: #777;
        font-weight: 400;
        font-size: 14px;
        line-height: 20px;
        border: 1px solid #dadada;
        resize: vertical;

        &:focus-visible {
          outline: none;
        }

        &:focus {
          color: #000;
        }

        &.disalbed {
          color: #777;
          background-color: #fff;
          border: 1px solid #fff;
          resize: none;
        }
      }
    }

    .placerholder {
      display:block;
      min-height: 16px;
    }

    .btn-group {
      display: none;
      align-items: center;
      justify-content: flex-end;
      width: 100%;
      
      .btn {
        width: 16px;
        height: 16px;
        cursor: pointer;
      }

      .btn + .btn {
        margin-left: 21px;
      }

      .delete-btn {
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }

    &:hover {
      filter: drop-shadow(0 8px 24px rgb(149 157 165 / 20%));
    }

    &:hover > .title > .icon-wrap {
      display: block;
    }
    
    &:hover > .placerholder {
      display: none;
    }
   
    &:hover > .btn-group {
      display: flex;
    }
  }
`

const globalCss = css.global`
  .edit-icon {
    margin-left: 8px;
    cursor: pointer;
  }

  .delete-icon {
    .del-btn-filled {
      display: none;
    }

    &:hover > .del-btn-filled {
      display: block;
    }
    &:hover > .del-btn-outline {
      display: none;
    }
  }
`

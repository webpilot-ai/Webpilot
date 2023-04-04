import css from 'styled-jsx/css'
import Avatar from 'react:@assets/images/avatar/avatar.svg'

export default function Engineer() {
  return (
    <section className="engineer">
      <Avatar />
      <a className="name" href="#">
        Lebron James
      </a>
      <style jsx>{styles}</style>
    </section>
  )
}

const styles = css`
  .engineer {
    display: flex;
    background-color: #4f5aff1a;
    margin-right: 16px;
    height: 80px;
    width: 183px;
    border-radius: 20px;
    align-items: center; /* align vertically */
    justify-content: center; /* align horizontally */

    .name {
      font-weight: 400;
      font-size: 14px;
      line-height: 20px;
    }
  }
`

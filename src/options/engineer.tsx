import css from 'styled-jsx/css'

import avatar from '/assets/images/avatar/avatar.svg'

export default function Engineer() {
  return (
    <section className="engineer">
      <img src={avatar} alt="" />
      <a className="name" href="#">
        LebronJames
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
    padding: 16px;
    align-items: center; /* align vertically */
    justify-content: center; /* align horizontally */
    img {
      width: 48px;
      height: 48px;
      margin-right: 16px;
    }
    .name {
      font-weight: 400;
      font-size: 14px;
      line-height: 20px;
    }
  }
`

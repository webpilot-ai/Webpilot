import css from 'styled-jsx/css'

import avatar from '../../../assets/images/avatar/avatar.svg'

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
    align-items: center; /* align vertically */
    justify-content: center; /* align horizontally */
    width: 183px;
    height: 80px;
    margin-right: 16px;
    padding: 16px;
    background-color: #4f5aff1a;
    border-radius: 20px;

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

import css from 'styled-jsx/css'

export default function Investor({info}) {
  return (
    <section className="investor">
      <span className="avatar">{info.avatar}</span>
      {info.page ? (
        <a className="name" href={info.page} target="_blank" rel="noreferrer">
          {info.name}
        </a>
      ) : (
        <span className="name">{info.name}</span>
      )}
      <span className="title">{info.company}</span>
      <style jsx>{styles}</style>
    </section>
  )
}

const styles = css`
  .investor {
    display: flex;
    flex-direction: column;
    width: 155px;
    height: 143px;
    margin-right: 16px;
    padding: 16px;
    background-color: #fff;
    border-radius: 20px;
    box-shadow: 0 8px 24px rgb(149 157 165 / 20%);

    @media screen and (max-width: 800px) {
      &:not(:last-child) {
        margin-bottom: 20px;
      }
    }

    .avatar {
      width: 48px;
      height: 48px;
      color: white;
      font-weight: 400;
      font-size: 24px;
      line-height: 48px;
      text-align: center;
      background-color: #4f5aff;
      border-radius: 50%;
    }

    .name {
      font-weight: 400;
      font-size: 14px;
      line-height: 20px;
    }

    .title {
      white-space: pre-wrap;
    }
  }
`

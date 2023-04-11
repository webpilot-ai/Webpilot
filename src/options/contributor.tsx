import css from 'styled-jsx/css'

export default function Contributor({info}) {
  return (
    <section className="engineer">
      <img src={info.avatar} alt="" />
      {info.page ? (
        <a className="name" href={info.page} target="_blank" rel="noreferrer">
          {info.name}
        </a>
      ) : (
        <span className="name">{info.name}</span>
      )}
      <span className="title">{ info.bio }</span>
      <style jsx>{styles}</style>
    </section>
  )
}

const styles = css`
  .engineer {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 155px;
    height: 143px;
    margin-right: 16px;
    padding: 16px;
    background-color: #fff;
    border-radius: 20px;
    box-shadow: 0 8px 24px rgb(149 157 165 / 20%);
    margin-bottom: 20px;
    
    img {
      width: 48px;
      height: 48px;
      margin-right: 16px;
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

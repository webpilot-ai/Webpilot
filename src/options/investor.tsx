import css from 'styled-jsx/css'

export default function Investor(props) {
  const fullName = props => {
    return props.info.last_name + props.info.first_name
  }
  return (
    <section className="investor">
      <span className="last-name">{props.info.last_name.slice(0, 1)}</span>
      <a className="name" href={props.info.page} target="_blank" rel="noreferrer">
        {fullName(props)}
      </a>
      <span className="title">{props.info.company}</span>
      <style jsx>{styles}</style>
    </section>
  )
}

const styles = css`
  .investor {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 155px;
    height: 143px;
    margin-right: 16px;
    padding: 16px;
    background-color: #ffffff;
    box-shadow: 0px 8px 24px rgba(149, 157, 165, 0.2);
    border-radius: 20px;
    @media screen and (max-width: 800px) {
      &:not(:last-child) {
        margin-bottom: 20px;
      }
    }

    .last-name {
      font-weight: 400;
      font-size: 24px;
      line-height: 48px;
      background-color: #4f5aff;
      color: white;
      height: 48px;
      width: 48px;
      text-align: center;
      border-radius: 50%;
    }

    .name {
      font-weight: 400;
      font-size: 14px;
      line-height: 20px;
    }
  }
`

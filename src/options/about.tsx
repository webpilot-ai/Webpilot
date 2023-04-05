import css from 'styled-jsx/css'

import Engineer from './engineer'

export default function About() {
  // dummy contributor here
  const demo = ['Jay chow', 'Lebrown James', 'Kobe Bryant', 'Noodles Zhuge']
  return (
    <section className="about">
      <div className="title">Contributors</div>
      <div className="sub-title">Engineering</div>
      <div className="engineers">
        {demo.map(index => {
          return <Engineer key={index} />
        })}
      </div>
      <style jsx>{styles}</style>
    </section>
  )
}

const styles = css`
  .about {
    margin-top: 28px;
    padding: 16px;
    background-color: #fff;
    border-radius: 10px;

    .title {
      font-weight: 400;
      font-size: 18px;
      line-height: 25px;
    }

    .sub-title {
      margin-top: 16px;
      font-weight: 500;
      font-size: 12px;
      line-height: 17px;
    }

    .engineers {
      display: flex;
      flex-direction: row;
      margin-top: 16px;
    }
  }
`

import css from 'styled-jsx/css'
import {useEffect, useState} from 'react'

import Engineer from './engineer'

export default function About() {
  // dummy contributor here
  const [engineers, setEngineers] = useState([
    'Jay chow',
    'Lebrown James',
    'Kobe Bryant',
    'Noodles Zhuge',
  ])

  return (
    <section className="about">
      <div className="title">Contributors</div>
      <div className="sub-title">Engineering</div>
      <div className="engineers">
        {engineers.map((engineer, index) => {
          return <Engineer />
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
    background-color: #ffffff;
    border-radius: 10px;

    .title {
      font-weight: 400;
      font-size: 18px;
      line-height: 25px;
    }

    .sub-title {
      margin-top: 16px;
      font-size: 12px;
      font-weight: 500;
      line-height: 17px;
    }

    .engineers {
      display: flex;
      flex-direction: row;
      margin-top: 16px;
    }
  }
`

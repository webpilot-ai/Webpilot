import css from 'styled-jsx/css'
import ContributorIcon from 'data-base64:~assets/images/About/contributors.svg'
import InvestorSvg from 'data-base64:~assets/images/About/investor.svg'

import {useState, useEffect} from 'react'

import Investor from './investor'
import Engineer from './engineer'

const ABOUT_API = 'https://raw.githubusercontent.com/Fluentify-IO/Fluentify/main/assets/about.json'

export default function About() {
  const [about, setAbout] = useState({})

  useEffect(() => {
    fetch(ABOUT_API)
      .then(res => res.json())
      .then(setAbout)
  }, [])

  const {contributors = [], investors = []} = about
  return (
    <section className="about">
      <div className="contributors">
        <div className="title">
          <img src={ContributorIcon} alt="" />
          <span>Contributors</span>
        </div>
        <div className="person-info">
          {contributors.map((info, index) => {
            return <Engineer key={index} info={info} />
          })}
        </div>
      </div>

      <div className="investors">
        <div className="title">
          <img src={InvestorSvg} alt="" />
          <span>Thanks to Investors</span>
        </div>
        <div className="person-info">
          {investors.map((info, index) => {
            return <Investor key={index} info={info} />
          })}
        </div>
      </div>

      <div className="donate">
        <a href="https://github.com/Fluentify-IO/Fluentify">Contact us to donate</a>
      </div>
      <style jsx>{styles}</style>
    </section>
  )
}

const styles = css`
  .about {
    margin-top: 32px;
    padding: 4px;
    border-radius: 10px;

    .title {
      display: flex;

      img {
        margin-right: 10px;
      }

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

    .person-info {
      display: flex;
      flex-flow: row wrap;
      margin-top: 7px;
    }

    .investors {
      margin-top: 32px;
    }

    .donate {
      margin-top: 16px;
      color: #4f5aff;
      font-weight: 400;
      font-size: 14px;
      line-height: 20px;
      text-decoration-line: underline;
    }
  }
`

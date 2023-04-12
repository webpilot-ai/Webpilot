import css from 'styled-jsx/css'
import {useState, useEffect} from 'react'

import {gettext} from '@/utils'

import Contributor from './contributor'
const ABOUT_API = 'https://raw.githubusercontent.com/webpilot-ai/data/main/about.json'

export default function About() {
  const [about, setAbout] = useState({})
  useEffect(() => {
    fetch(ABOUT_API)
      .then(res => res.json())
      .then(setAbout)
  }, [])
  const {contributors = [], sponsors = [], donate = {}} = about
  return (
    <section className="about">
      <div className="contributors">
        <div className="title">
          <span>{gettext('Contributors')}</span>
        </div>
        <div className="person-info">
          {contributors.map((info, index) => {
            return <Contributor key={index} info={info} />
          })}
        </div>
      </div>

      <div className="investors">
        <div className="title">
          <span>{gettext('Thanks to Sponsors')}</span>
        </div>

        <div className="person-info">
          {sponsors.map((info, index) => {
            return <Contributor key={index} info={info} />
          })}
        </div>
      </div>

      <div className="donate">
        <a href={donate.link} target="_black">
          {donate.text}
        </a>
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
      margin-top: 12px;
    }

    .donate {
      color: #4f5aff;
      font-weight: 400;
      font-size: 14px;
      line-height: 20px;
      text-decoration-line: underline;
    }
  }
`

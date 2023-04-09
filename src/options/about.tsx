import css from 'styled-jsx/css'

import ContributorIcon from 'data-base64:~assets/images/about/contributors.svg'
import InvestorSvg from 'data-base64:~assets/images/about/investor.svg'
import {useState, useEffect} from 'react'

import Investor from './investor'
import Engineer from './engineer'

export default function About() {
  // dummy contributor here
  const [contributors, setContributors] = useState([])
  const [investors, setInvestors] = useState([])

  useEffect(() => {
    // fetch to get contributors
    const data = {
      contributor_group: {
        frontend_engineer: {
          en: 'Frontend Engineer',
          zh_CN: '前端工程师',
        },
        ui_designer: {
          en: 'UI Designer',
          zh_CN: 'UI 设计师',
        },
      },
      contributors: [
        {
          name: 'Noodles Z',
          avatar: 'avatar.svg',
          page: 'https://www.google.ca',
          title: 'Web Developer',
          desc: '介绍',
          group: 'frontend_engineer',
        },
        {
          name: 'Noodles Z',
          avatar: 'avatar.svg',
          page: 'https://www.google.ca',
          title: 'Web Developer',
          desc: '介绍',
          group: 'frontend_engineer',
        },
        {
          name: 'Noodles Z',
          avatar: 'avatar.svg',
          page: 'https://www.google.ca',
          title: 'Web Developer',
          desc: '介绍',
          group: 'frontend_engineer',
        },
      ],
      investors: [
        {
          first_name: 'Baba',
          last_name: 'X',
          page: 'https://www.google.ca',
          company: '个人捐赠',
          desc: '介绍',
        },
        {
          first_name: 'Ayi',
          last_name: '老',
          page: 'https://www.google.ca',
          company: '暴风城军情六处',
          desc: '介绍',
        },
        {
          first_name: 'Gandie',
          last_name: 'Gan',
          page: 'https://www.google.ca',
          company: '奥格瑞玛大门老大爷对象的秧歌队',
          desc: '介绍',
        },
      ],
    }
    setContributors(data.contributors)
    setInvestors(data.investors)
  }, [])

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
    margin-top: 28px;
    padding: 16px;
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

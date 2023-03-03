import style from './style.module.scss'
import Settings from 'react:./icon/settings.svg'
import ArrowLeft from 'react:./icon/arrow-left.svg'

import Tooltip from 'rc-tooltip/es'

import {gettext, navToOptions} from '@/utils'

export default function Header({children = null, back = null}) {
  return (
    <section className={style.header}>
      {back ? (
        <div onClick={back} className={style.back}>
          <ArrowLeft />
        </div>
      ) : (
        children || <h1 className={style.title}>Fluentify</h1>
      )}

      <Tooltip
        showArrow={false}
        placement="left"
        overlay={() => <span>{gettext('Settings')}</span>}
      >
        <div onClick={navToOptions}>
          <Settings className={style.settings} />
        </div>
      </Tooltip>
    </section>
  )
}

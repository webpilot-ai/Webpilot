import style from './style.module.scss'
import 'react-toastify/dist/ReactToastify.css'

import {ToastContainer} from 'react-toastify'
import {HashRouter, Routes, Route, Outlet} from 'react-router-dom'

import {ROUTE} from '@/config'

import {withAIContext} from '@/components/with-ai-context'

import EntryPanel from './entry-panel'
import PresetPanel from './preset-panel'
import CustomPanel from './custom-panel'

export default withAIContext(function Index() {
  return (
    <div className={style.container}>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Outlet />}>
            <Route index element={<EntryPanel />} />
            <Route path={ROUTE.POPUP_PRESET_PANEL} element={<PresetPanel />} />
            <Route path={ROUTE.POPUP_CUSTOM_PANEL} element={<CustomPanel />} />
          </Route>
        </Routes>
      </HashRouter>

      <ToastContainer />
    </div>
  )
})

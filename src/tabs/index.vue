<script setup>
import {createApp} from 'vue'

import {createPinia} from 'pinia'

import {i18nPlugin} from '@/utils/i18n'
import useStore from '@/stores/store'

import WelcomePage from './components/WelcomePage.vue'
import 'vue-toast-notification/dist/theme-bootstrap.css'

const app = createApp(WelcomePage)
const pinia = createPinia()
app.use(pinia)
app.use(i18nPlugin)

const store = useStore()
store.initConfig().then(() => {
  app.mount('#webpilot-setup-page')
})
</script>

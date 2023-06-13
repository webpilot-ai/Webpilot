<template>
  <div></div>
</template>

<script setup>
import {createApp} from 'vue'

import {createPinia} from 'pinia'

import {i18nPlugin} from '@/utils/i18n'
import useStore from '@/stores/store'

import WebpilotPopup from './componetns/WebpilotPopup.vue'
import 'vue-toast-notification/dist/theme-bootstrap.css'

const app = createApp(WebpilotPopup)
const pinia = createPinia()
app.use(pinia)
app.use(i18nPlugin)

const soterConfig = useStore()
soterConfig.initConfig().then(() => {
  app.mount('#webpilot-popup-page')
})
</script>

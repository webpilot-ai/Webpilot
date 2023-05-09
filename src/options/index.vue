<script setup>
import {createApp} from 'vue'

import {createPinia} from 'pinia'

import {i18nPlugin} from '@/utils/i18n'

import TheEntry from './TheEntry.vue'

const app = createApp(TheEntry)
const pinia = createPinia()
app.use(pinia)
app.use(i18nPlugin)
app.mount('#webpilot-options-page')
</script>

<template>
  <div></div>
</template>

<script setup>
import '@/featureFlagsConfig'

import {createApp} from 'vue'

import {createPinia} from 'pinia'

import {i18nPlugin} from '@/utils/i18n'
import useStore from '@/stores/store'

import TheEntry from './TheEntry.vue'

const app = createApp(TheEntry)
const pinia = createPinia()
app.use(pinia)
app.use(i18nPlugin)

const store = useStore()
store.initConfig().then(() => {
  app.mount('#webpilot-options-page')
})
</script>

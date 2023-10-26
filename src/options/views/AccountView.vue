<template>
  <div :class="$style['account-view']">
    <h2 :class="$style.title">Credit</h2>
    <div :class="$style['credit-wrap']">
      <CreditRadioGroup
        v-model="creditSource"
        :class="$style['credit-radio-group']"
        @change="onChangeApiSource"
      />
      <CreditWebpilotStatus v-if="creditSource === CREDIT_SOURCES.WEBPILOT" />
      <CreditOpenAI v-else-if="creditSource === CREDIT_SOURCES.OPENAI" />
    </div>

    <h2>Linked Account</h2>
    <LinkedAccount />
  </div>
</template>
<script setup lang="ts">
import {onMounted, ref} from 'vue'

import useStore from '@/stores/store'

import {API_ORIGINS, WEBPILOT_OPENAI} from '@/config'

import CreditRadioGroup from '../components/CreditRadioGroup.vue'
import CreditWebpilotStatus from '../components/CreditWebpilotStatus.vue'
import CreditOpenAI from '../components/CreditOpenAI.vue'
import LinkedAccount from '../components/LinkedAccount.vue'

const CREDIT_SOURCES = {
  WEBPILOT: 'webpilot',
  OPENAI: 'openAI',
}

const store = useStore()

const creditSource = ref(CREDIT_SOURCES.WEBPILOT)

onMounted(() => {
  const {apiOrigin} = store.config
  if (apiOrigin !== API_ORIGINS.GENERAL) {
    creditSource.value = CREDIT_SOURCES.OPENAI
  }
})

const onChangeApiSource = () => {
  if (creditSource.value === CREDIT_SOURCES.WEBPILOT) {
    store.setConfig({
      ...store.config,
      apiOrigin: API_ORIGINS.GENERAL,
      isAuth: true,
      isFinishSetup: true,
      selfHostUrl: WEBPILOT_OPENAI.HOST_URL,
    })
  }
}
</script>

<style lang="scss" module>
.credit-wrap {
  margin-bottom: 64px;
}

.credit-radio-group {
  margin-bottom: 24px;
}

.account-view {
  width: 465px;
  color: var(--color-baseline-text);
}

.title {
  margin: 0;
  margin-bottom: 24px;
  font-weight: 600;
  font-size: 24px;
}
</style>

<template>
  <div :class="$style['account-view']">
    <h2 :class="$style.title">Credit</h2>
    <div :class="$style['credit-wrap']">
      <CreditRadioGroup v-model="creditTye" :class="$style['credit-radio-group']" />
      <CreditWebpilotStatus v-if="creditTye === CreditTypes.webpilot" />
      <CreditOpenAI v-else-if="creditTye === CreditTypes.openAI" />
    </div>

    <h2>Linked Account</h2>
    <LinkedAccount />
  </div>
</template>
<script setup lang="ts">
import {ref} from 'vue'

import CreditRadioGroup from '../components/CreditRadioGroup.vue'
import CreditWebpilotStatus from '../components/CreditWebpilotStatus.vue'
import CreditOpenAI from '../components/CreditOpenAI.vue'
import LinkedAccount from '../components/LinkedAccount.vue'

const CreditTypes = {
  webpilot: 'webpilot',
  openAI: 'openAI',
}
const creditTye = ref(CreditTypes.openAI)
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

<template>
  <div :class="$style['linked-account-wrap']">
    <IconGoogleLogo :class="$style['icon-google-logo']" />
    <span :class="$style['email-addr']">{{ user }}</span>
    <button :class="$style['unlink-btn']" @click="onUnlink">UNLINK</button>
  </div>
</template>

<script setup lang="ts">
import {storeToRefs} from 'pinia'

import useUserStore from '@/stores/user'

import IconGoogleLogo from '../images/icon-logo-google.vue'

const userStore = useUserStore()
const {user} = storeToRefs(userStore)
const {getUser, unlink} = userStore

if (!user.value) {
  getUser()
}

const onUnlink = () => {
  unlink()
}
</script>

<style module lang="scss">
.linked-account-wrap {
  display: flex;
  align-items: center;
  color: var(--color-baseline-text);
  font-size: 14px;
}

.icon-google-logo {
  margin-right: 8px;
}

.email-addr {
  margin-right: 32px;
}

.unlink-btn {
  color: var(--color-brand-primary);
  font-weight: 600;
  background: unset;
  border: 0;
  cursor: pointer;
}

.unlink-btn:hover {
  filter: brightness(0.8);
}
</style>

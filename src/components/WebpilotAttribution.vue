<template>
  <section :class="$style.wrap">
    <img :class="$style.logo" :src="WebpilotLogo" />
    <span :class="$style.text">Powered by Webpilot</span>
  </section>
</template>

<script setup>
import WebpilotLogo from 'data-base64:~assets/icon.png'
</script>

<style lang="scss" module>
.wrap {
  display: flex;
  align-items: center;
}

.logo {
  width: 16px;
  height: 16px;
  margin-right: 4px;
}

.text {
  color: #929497;
  font-weight: 600;
  font-size: 12px;
  line-height: 16px;
}
</style>

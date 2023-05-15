<script setup>
import IconHelp from '@/components/icon/IconHelp.vue'

defineProps({
  value: {
    type: String,
    default: '',
  },
  url: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <section :class="$style.helpTips">
    <IconHelp :class="$style.logo" />
    <span v-if="url === ''" :class="$style.helpSpan">{{ value }}</span>
    <a v-else :href="url" target="_blank">{{ value }}</a>
  </section>
</template>

<style module lang="scss">
.helpTips {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 8px;
  color: #585b58;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  text-align: right;
  text-decoration-line: underline;

  a:visited {
    color: #585b58;
  }
}

.logo {
  margin-right: 6px;
}
</style>

<template>
  <section :class="$style.container">{{ name }}</section>
</template>

<script setup>
import {ref} from 'vue'

const name = ref('Webpilot popup box')
</script>

<style lang="scss" module>
.container {
  color: #fff;
  font-size: 24px;
}
</style>

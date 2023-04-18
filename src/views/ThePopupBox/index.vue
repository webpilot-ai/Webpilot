<template>
  <section :class="$style.container">{{ name }}</section>
</template>

<script setup>
import {ref} from 'vue'

const name = ref('Webpilot')
</script>

<style module lang="scss">
.container {
  color: #fff;
  font-size: 24px;
}
</style>

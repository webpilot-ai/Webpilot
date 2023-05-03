<template>
  <section :class="$style.container">{{ name }} hi?</section>
</template>

<script setup>
import {ref} from 'vue'

const name = ref('Webpilot sidebar')
</script>

<style lang="scss" module>
.container {
  font-size: 24px;
}
</style>

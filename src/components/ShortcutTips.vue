<template>
  <section :class="$style.tipsGroup">
    <TipsOperation tips="Tips: You can also customize quick prompts" />
    <TipsShortcut :class="$style.tipsShortcut" />
  </section>
</template>

<script setup>
import TipsOperation from './TipsNormal.vue'
import TipsShortcut from './TipsShortcut.vue'
</script>

<style lang="scss" module>
.tipsGroup {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 8px !important;
}

.tipsShortcut {
  margin-left: auto !important;
}
</style>

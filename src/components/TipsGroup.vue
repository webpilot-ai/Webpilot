<template>
  <section :class="$style.tipsGroup">
    <TipsOperation v-if="showTextTips" :tips="tipsText" />
    <TipsShortcut :class="$style.tipsShortcut" />
  </section>
</template>

<script setup>
import TipsOperation from './TipsOperation.vue'
import TipsShortcut from './TipsShortcut.vue'

// eslint-disable-next-line
const props = defineProps({
  showTextTips: {
    type: Boolean,
    require: true,
    default: true,
  },
  tipsText: {
    type: String,
    default: 'Tips: You can also select text and ask',
  },
})
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

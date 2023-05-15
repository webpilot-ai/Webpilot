<script setup>
import IconJigsaw from '@/components/icon/IconJigsaw.vue'
import IllustrationPinGuide from '@/components/icon/IllustrationPinGuide.vue'
</script>

<template>
  <div>
    <h2 :class="$style.title">Active Webpilot from nav bar</h2>
    <div :class="$style.guide">Click <IconJigsaw />and ping Webpilot to your nav bar</div>
    <IllustrationPinGuide />
  </div>
</template>

<style module lang="scss">
.title {
  color: #292929;
  font-weight: 400;
  font-size: 18px;
  line-height: 25px;
}

.guide {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 8px;
  margin-bottom: 13px;
  color: #292929;
  font-size: 14px;
  line-height: 20px;
}
</style>

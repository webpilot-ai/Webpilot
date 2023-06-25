<template>
  <div :class="$style.wrap">
    <h3>Pin Webpilot for easy access</h3>
    <div :class="$style.guide">Click <IconJigsaw />and ping Webpilot to your nav bar</div>
    <IllustrationPinGuide />
  </div>
</template>

<script setup>
import IconJigsaw from '@/components/icon/IconJigsaw.vue'
import IllustrationPinGuide from '@/components/icon/IllustrationPinGuide.vue'
</script>

<style module lang="scss">
.wrap {
  h3 {
    margin: 0 0 16px;
    color: #4f5aff;
    font-weight: 400;
    font-size: 24px;
    line-height: 34px;
    text-align: center;
  }
}

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

  svg {
    margin: 0 4px;
  }
}
</style>

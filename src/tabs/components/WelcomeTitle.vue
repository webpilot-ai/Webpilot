<template>
  <h1 :class="$style.wrap">
    <p :class="$style.text"><slot></slot></p>
    <IconBackArrow :class="$style.icon" @click="goBack" />
  </h1>
</template>

<script setup>
import IconBackArrow from '@/components/icon/IconBackArrow.vue'

const emits = defineEmits(['onPrev'])
const goBack = () => {
  emits('onPrev')
}
</script>

<style module lang="scss">
.wrap {
  height: 24px;
  margin: 0;
  text-align: left;

  .text {
    margin: 0;
    color: #4f5aff;
    font-weight: 400;
    font-size: 24px;
    line-height: 1;
    text-align: center;
  }

  .icon {
    transform: translateY(-100%);
    cursor: pointer;
  }
}
</style>

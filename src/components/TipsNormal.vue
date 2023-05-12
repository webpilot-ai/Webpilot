<template>
  <section
    :class="$style.operationTips"
    :style="{
      color: color,
    }"
  >
    <slot name="icon">
      <IconTips />
    </slot>
    {{ tips }}
  </section>
</template>

<script setup>
import IconTips from './icon/IconTips.vue'

// eslint-disable-next-line
const props = defineProps({
  tips: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    default: '#585b58',
  },
})
</script>

<style lang="scss" module>
.operationTips {
  display: flex;
  flex-direction: row;
  gap: 10px;
  align-items: flex-start;
  width: fit-content;
  height: 27px;
  max-height: 27px;
  padding: 5px 8px 5px 6px;
  font-weight: 500;
  font-size: 12px;
  line-height: 17px;
  background: linear-gradient(0deg, rgb(79 90 255 / 10%), rgb(79 90 255 / 10%)), #fff;
  border-radius: 4px;
}
</style>

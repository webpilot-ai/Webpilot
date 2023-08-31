<template>
  <div :class="$style['setting-alert-frame']">
    <div :class="$style['title-wrap']" :style="`color: ${color}`">
      <div :class="$style['icon-wrap']">
        <slot name="icon"><IconInfor /></slot>
      </div>
      <span>{{ title }}</span>
    </div>
    <div :class="$style['alert-desc']">
      <slot name="desc">
        {{ desc }}
      </slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
import IconInfor from '../images/icon-infor-filled.vue'
// eslint-disable-next-line
const props = defineProps({
  title: {
    type: String,
    default: 'title',
  },
  color: {
    type: String,
    default: '#4F5AFF',
  },
  desc: {
    type: String,
    default: '',
  },
})
</script>

<style lang="scss" module>
.setting-alert-frame {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  width: 320px;
  height: 99px;
  padding: 12px;
  background: #fff;
  border: 1px solid #4f5aff33;
  border-radius: 10px;
}

.title-wrap {
  display: flex;
  height: 24px;
  color: var(--color-brand-primary, #4f5aff);
  font-weight: 600;
  font-size: 14px;
}

.icon-wrap {
  width: 24px;
  margin-right: 8px;
}

.alert-desc {
  margin-top: 4px;
  margin-left: 32px;
}
</style>

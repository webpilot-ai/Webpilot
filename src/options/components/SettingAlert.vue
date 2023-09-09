<template>
  <div :class="[$style['setting-alert-frame'], inline ? $style['setting-alert-inline'] : null]">
    <div :class="$style['title-wrap']" :style="`color: ${color}`">
      <div :class="$style['icon-wrap']">
        <slot name="icon"><IconInfor /></slot>
      </div>
      <span>{{ title }}</span>
    </div>
    <div v-if="!inline" :class="$style['alert-desc']">
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
  inline: {
    type: Boolean,
    default: false,
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

.icon-wrap {
  width: 24px;
  margin-right: 8px;
}

.setting-alert-inline {
  width: fit-content;
  height: 28px;
  padding: 5px 6px;
  font-weight: 600;
  font-size: 12px;
  font-family: var(--default-font-family);
  background: linear-gradient(0deg, rgb(79 90 255 / 10%) 0%, rgb(79 90 255 / 10%) 100%);
  border: none;
  border-radius: 4px;

  .icon-wrap {
    width: 16px;
    margin-right: 6px;
  }

  svg {
    width: 16px;
    height: 16px;
  }
}

.title-wrap {
  display: flex;
  height: 24px;
  color: var(--color-brand-primary, #4f5aff);
  font-weight: 600;
  font-size: 14px;
}

.alert-desc {
  margin-top: 4px;
  margin-left: 32px;
}
</style>

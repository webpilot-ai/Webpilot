<template>
  <section
    ref="refAlert"
    :class="{
      [$style.tips]: true,
      [$style.tipsError]: type === ALERT_TYPE.ERROR,
      [$style.tipsSuccess]: type === ALERT_TYPE.SUCCESS,
    }"
    :style="{
      color: color,
    }"
  >
    <slot name="icon">
      <IconInfo v-if="type === ALERT_TYPE.INFO" />
      <IconSuccess v-if="type === ALERT_TYPE.SUCCESS" />
      <IconError v-if="type === ALERT_TYPE.ERROR" />
    </slot>
    {{ tips }}
  </section>
</template>

<script setup>
import {ref} from 'vue'
import {onClickOutside} from '@vueuse/core'

import IconInfo from './icon/IconAlertInfo.vue'
import IconError from './icon/IconAlertError.vue'
import IconSuccess from './icon/IconAlertSuccess.vue'

const props = defineProps({
  type: {
    type: String,
    required: true,
    default: '',
  },
  tips: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    default: '#585b58',
  },
  autoHide: {
    type: Boolean,
    default: false,
  },
})

const emits = defineEmits(['onHide'])

const refAlert = ref(null)

onClickOutside(refAlert, () => {
  if (props.autoHide) emits('onHide')
})

const ALERT_TYPE = {
  INFO: 'info',
  ERROR: 'error',
  SUCCESS: 'success',
}

// eslint-disable-next-line
</script>

<style lang="scss" module>
.tips {
  display: flex;
  flex-direction: row;
  gap: 10px;
  align-items: center;
  width: fit-content;
  min-height: 27px;
  padding: 5px 8px 5px 6px;
  font-weight: 500;
  font-size: 12px;
  line-height: 17px;
  background: linear-gradient(0deg, rgb(79 90 255 / 10%), rgb(79 90 255 / 10%)), #fff;
  border-radius: 4px;
}

.tipsSuccess {
  color: #318619;
}

.tipsError {
  color: #c00;
}
</style>

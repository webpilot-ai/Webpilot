<template>
  <div>
    <div :class="$style['credit-status']">
      <div :class="$style['credit-progress']">
        <div :class="$style['credit-progress-frame']"></div>
        <div
          :class="$style['credit-progress-bar']"
          :style="{
            width: `${0.05 * 320}px`,
          }"
        ></div>
      </div>
      <Popper arrow arrow-padding="0" :class="$style.popper" hover offset-distance="0">
        <IconQuestions :class="$style['question-icon']" />
        <template #content>
          <div>API limits to 50 times per week. It refreshes every Monday at 0:00 UTC+0</div>
        </template>
      </Popper>
      <span :class="$style['credit-text']">{{ usage.current }}/{{ usage.total }} available</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import Popper from 'vue3-popper'
import {storeToRefs} from 'pinia'

import useUserStore from '@/stores/user'

import IconQuestions from '../images/icon-question-outline.vue'

const userStore = useUserStore()
const {usage} = storeToRefs(userStore)
const {getUsage} = userStore

if (usage.value.current === -1) {
  getUsage()
}
</script>

<style lang="scss" module>
.credit-status {
  display: flex;
  align-items: center;
  color: var(--color-baseline-text);
  font-weight: 400;
  font-size: 14px;
}

.credit-progress {
  position: relative;
  margin-right: 12px;
  overflow: hidden;
  border-radius: 20px;
}

.credit-progress-frame {
  width: 320px;
  height: 24px;
  background: #edeff2;
  border-radius: 20px;
}

.credit-progress-bar {
  position: absolute;
  top: 0;
  left: 0;
  height: 24px;
  background: linear-gradient(270deg, #4128d3 0%, #4f5aff 28%, #6a8bff 100%);
  border-radius: 20px;
  opacity: 0.7;
}

.question-icon {
  margin-right: 6px;
  border: 0;
  fill: #585b58;
}

.popper {
  width: 24px;
  height: 24px;
}

.credit-text {
  margin-left: 6px;
}
</style>

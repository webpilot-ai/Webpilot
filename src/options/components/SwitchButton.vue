<template>
  <div class="switch" :class="{'switch--on': switchOn}" @click="toggleSwitch">
    <div class="switch__handle"></div>
    <div class="switch__label" :class="switchOn ? 'on' : 'off'">
      {{ switchOn ? onText : offText }}
    </div>
  </div>
</template>

<script setup>
import {ref} from 'vue'

const switchOn = ref(false)
const onText = 'ON'
const offText = 'OFF'

function toggleSwitch() {
  switchOn.value = !switchOn.value
}
</script>

<style scoped>
.switch {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 22px;
  background-color: #c4c4c4;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.2s;
}

.switch--on {
  background-color: #4f5aff;
}

.switch__handle {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 16px;
  height: 16px;
  background-color: #fff;
  border-radius: 18px;
  box-shadow: 0 2px 4px rgb(0 0 0 / 20%);
  transition: all 0.2s;
}

.switch--on .switch__handle {
  transform: translateX(28px);
}

.switch__label {
  position: absolute;
  top: 50%;
  color: #fff;
  font-weight: 500;
  font-size: 12px;
  line-height: 17px;
  transform: translate(-50%, -50%);
}

.off {
  left: 60%;
}
</style>

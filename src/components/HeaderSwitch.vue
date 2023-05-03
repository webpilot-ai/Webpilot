<template>
  <section :class="$style.switchWrap">
    <section :class="{[$style.autoPilot]: true, [$style.autoPilotActived]: isChecked}">
      Auto Pilot
    </section>
    <input
      id="switch"
      v-model="isChecked"
      :class="$style.input"
      type="checkbox"
      @change="updateParent"
    />
    <label :class="$style.switch" for="switch">
      <span
        :class="{[$style.switchText]: true, [$style.switchTextHideOff]: isChecked}"
        turnOff="OFF"
        turnOn="ON"
      ></span>
    </label>
  </section>
</template>

<script setup>
import {ref} from 'vue'

const emits = defineEmits(['update:modelValue'])

const isChecked = ref(false)

function updateParent() {
  emits('update:modelValue', isChecked.value)
}
</script>

<style lang="scss" module>
.switchWrap {
  position: relative;
  display: block;
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 24px;
  overflow: hidden;
  color: black;
  line-height: 17px;
}

.input {
  width: 0;
  height: 0;
  margin: 0;
  visibility: hidden;
}

.autoPilot {
  margin-right: 6px !important;
  font-weight: 500;
  font-size: 12px;
  line-height: 17px;
  text-decoration-line: underline;
}

.autoPilotActived {
  color: #4f5aff;
}

.switchTextHideOff::after {
  content: '' !important;
}

.switch {
  position: relative;
  display: block;
  box-sizing: border-box;
  width: 50px;
  height: 22px;
  border: 2px solid #929497;
  border-radius: 18px;
  cursor: pointer;
}

.switch:active::after {
  width: 48px;
}

.input:checked + .switch {
  background-color: #4f5aff;
  border-color: #4f5aff;
}

.input:checked + .switch::after {
  left: calc(100% - 2px);
  background-color: #fff;
  transform: translateX(-100%);
}

.switch::after {
  position: absolute;
  top: 1px;
  left: 1px;
  width: 16px;
  height: 16px;
  background-color: #585b58;
  border-radius: 8px;
  transition: 0.3s;
  content: '';
}

.switchText {
  height: 22px;
}

.switchText::before,
.switchText::after {
  display: block;
  box-sizing: border-box;
  color: #000;
  font-weight: bold;
}

.switchText::before {
  position: absolute;
  top: 1px;
  left: 2px;
  display: block;
  color: #fff;
  font-weight: 500;
  font-size: 12px;
  line-height: 17px;
  content: attr(turnOn);
}

.switchText::after {
  position: absolute;
  top: 1px;
  right: 5px;
  display: block;
  color: #000;
  font-weight: 500;
  font-size: 12px;
  line-height: 17px;
  content: attr(turnOff);
}
</style>

<template>
  <div :class="setup.setup">
    <div :class="setup.title">
      <IconLogoAndText />
      <h1>Opensource | AI Assistant on All Websites</h1>
    </div>
    <main :class="setup.main">
      <ul :class="setup.steps">
        <li :class="{[setup.stepItem]: true, [setup.stepItemActive]: stepIndex === 1}">1</li>
        <li :class="{[setup.stepItem]: true, [setup.stepItemActive]: stepIndex === 2}">2</li>
        <li :class="{[setup.stepItem]: true, [setup.stepItemActive]: stepIndex === 3}">3</li>
      </ul>
      <div :class="setup.form">
        <h2 :class="setup.formTitle">Set up your API Key</h2>
        <div :class="setup.infoInputArea">
          <!-- Step One -->
          <StepOne v-if="stepIndex === 1" v-model="authSuccess" />
          <!-- Setp Two -->
          <StepTwo v-else-if="stepIndex === 2" />
          <!-- Setp Three -->
          <StepThree v-else-if="stepIndex === 3" />
          <!-- NEXT BUTTON -->
          <div :class="setup.btnGroup">
            <WebpilotButton
              v-if="stepIndex !== 1"
              type="ghost"
              value="BACK"
              @click="handleGoBackBtn"
            />
            <WebpilotButton
              :disalbed="isNexBtnDisabled"
              :value="stepIndex === 3 ? 'DONE' : 'NEXT'"
              @click="handleNextBtn"
            />
          </div>
        </div>
      </div>
      <div :class="setup.githubInfo">
        <span>Webpilot is opensource </span>
        <a href="https://github.com/webpilot-ai/Webpilot" target="_blank">Star on Github</a>
      </div>
    </main>
  </div>
</template>

<script setup>
import '@assets/styles/reset.scss'

import {computed, ref} from 'vue'
import {storeToRefs} from 'pinia'

import useConfigStore from '@/stores/config'

import IconLogoAndText from '@/components/icon/IconLogoAndText.vue'
import WebpilotButton from '@/components/WebpilotButton.vue'

import StepOne from './StepOne.vue'
import StepTwo from './StepTwo.vue'
import StepThree from './StepThree.vue'

const storeConfig = useConfigStore()
const {config} = storeToRefs(storeConfig)

/** Step Index */
const stepIndex = ref(1)
/** Auth Status */
const authSuccess = ref(config.value.isAuth)

const isNexBtnDisabled = computed(() => {
  if (stepIndex.value === 1) return !authSuccess.value

  return false
})

const handleNextBtn = () => {
  if (stepIndex.value === 1 && authSuccess.value) {
    stepIndex.value = 2
  } else if (stepIndex.value === 2) {
    stepIndex.value = 3
  } else if (stepIndex.value === 3) {
    window.close()
  }
}

const handleGoBackBtn = () => {
  if (stepIndex.value === 1) return

  if (stepIndex.value === 2) {
    stepIndex.value = 1
  } else if (stepIndex.value === 3) {
    stepIndex.value = 2
  }
}
</script>

<style module="setup" lang="scss">
.setup {
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  padding: 32px;
  padding-bottom: 0;
  background: linear-gradient(150.76deg, #efdaff 12.93%, #b28aff 64.87%, #6f63ff 108.73%);
  backdrop-filter: blur(5px);
}

.title {
  display: flex;
  flex-direction: row;
  align-items: center;
  font-weight: 400;
  font-size: 18px;
  line-height: 25px;

  h1 {
    margin-left: 19px;
    font-weight: 400;
    font-size: 18px;
    line-height: 25px;
  }
}

.main {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-top: 24px;
  padding-top: 32px;
  background: rgb(255 255 255 / 60%);
  border: 1px solid #fff;
  border-radius: 20px 20px 0 0;
}

.steps {
  display: flex;
  flex-direction: row;
  margin: 0;
  padding: 0;
  list-style-type: none;
}

.stepItem {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  color: #4f5aff;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  background: rgb(255 255 255 / 60%);
  border: 1px solid #fff;
  border-radius: 50%;
  user-select: none;
}

.stepItem + .stepItem {
  margin-left: 24px;
}

.stepItemActive {
  color: #fff;
  background-color: #4f5aff;
  border: none;
}

.form {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 480px;
  margin-top: auto;
  margin-bottom: auto;

  .formTitle {
    font-weight: 400;
    font-size: 24px;
    line-height: 34px;
  }
}

.infoInputArea {
  position: relative;
  width: 480px;
  min-height: 400px;
  margin-top: 24px;
  padding: 24px;
  background: #fff;
  border-radius: 0 10px 10px;
}

.btnGroup {
  position: absolute;
  right: 16px;
  bottom: 16px;
  display: flex;

  button:nth-child(2) {
    margin-left: 8px;
  }
}

.githubInfo {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: auto;
  margin-bottom: 16px;
  font-weight: 400;
  font-size: 18px;
  line-height: 25px;

  a {
    text-decoration: none;
  }

  a:visited {
    color: #4f5aff;
  }
}
</style>

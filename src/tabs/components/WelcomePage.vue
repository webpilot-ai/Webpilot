<template>
  <div :class="setup.setup">
    <div :class="setup.title">
      <IconLogoAndText />
      <h1>Opensource | AI Assistant on All Websites</h1>
    </div>
    <main :class="setup.main">
      <div :class="setup.form">
        <ul :class="setup.steps">
          <li :class="{[setup.stepItem]: true, [setup.stepItemActive]: stepIndex === 1}">1</li>
          <li :class="{[setup.stepItem]: true, [setup.stepItemActive]: stepIndex === 2}">2</li>
          <li :class="{[setup.stepItem]: true, [setup.stepItemActive]: stepIndex === 3}">3</li>
          <li :class="{[setup.stepItem]: true, [setup.stepItemActive]: stepIndex === 4}">4</li>
        </ul>
        <div :class="setup.infoInputArea">
          <!-- Step One -->
          <StepOne v-if="stepIndex === 1" :skip="handleSkip" />
          <!-- Setp Two -->
          <StepTwo v-else-if="stepIndex === 2" v-model="authInfo" />
          <!-- Setp Three -->
          <StepThree v-else-if="stepIndex === 3" />
          <!-- Setp Four -->
          <StepFour v-else-if="stepIndex === 4" />
          <!-- NEXT BUTTON -->
          <div :class="setup.btnGroup">
            <WebpilotButton
              v-if="stepIndex !== 1"
              type="ghost"
              value="BACK"
              @click="handleGoBackBtn"
            />
            <WebpilotButton
              v-if="stepIndex !== 1"
              :loading="loading"
              :value="stepIndex === 4 ? 'DONE' : 'NEXT'"
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

import {ref} from 'vue'
import {useToast} from 'vue-toast-notification'

import useStore from '@/stores/store'
import useUserStore from '@/stores/user'
import {WEBPILOT_OPENAI} from '@/config'

import IconLogoAndText from '@/components/icon/IconLogoAndText.vue'
import WebpilotButton from '@/components/WebpilotButton.vue'
import useAskAi from '@/hooks/useAskAi'

import StepOne from './StepOne.vue'
import StepTwo from './StepTwo.vue'
import StepThree from './StepThree.vue'
import StepFour from './StepFour.vue'

const userStore = useUserStore()
const {getUser} = userStore

getUser()

const toast = useToast()
const storeConfig = useStore()

const {loading, askAi} = useAskAi()

/** Step Index */
const stepIndex = ref(1)
/** AuthInfo */
const authInfo = ref({
  authKey: '',
  selfHostUrl: '',
  selectedOption: 'personal',
})

const handleSkip = () => {
  stepIndex.value = 2
}

const checkAuthKey = async () => {
  const {selectedOption} = authInfo.value
  let {authKey, selfHostUrl} = authInfo.value

  if (selectedOption === 'general') {
    authKey = WEBPILOT_OPENAI.AUTH_KEY
    selfHostUrl = WEBPILOT_OPENAI.HOST_URL
  }

  // check toekn and self host change
  if (authKey === storeConfig.config.authKey && selfHostUrl === storeConfig.config.selfHostUrl) {
    stepIndex.value = 3
    return
  }

  try {
    await askAi({
      authKey,
      command: 'Say hi.',
      url: selfHostUrl === '' ? null : selfHostUrl,
    })

    storeConfig.setConfig({
      ...storeConfig.config,
      isAuth: true,
      authKey,
      isFinishSetup: true,
      selfHostUrl: selfHostUrl !== '' ? selfHostUrl : '',
    })
    stepIndex.value = 3
  } catch (error) {
    toast.open({
      message: 'Incorrect API Key. Please check with the provider',
      type: 'error',
      position: 'top',
    })
  }
}

const handleNextBtn = async () => {
  if (stepIndex.value === 2) {
    await checkAuthKey()
  } else if (stepIndex.value === 3) {
    stepIndex.value = 4
  } else if (stepIndex.value === 4) {
    window.close()
  }
}

const handleGoBackBtn = () => {
  if (stepIndex.value === 1) return

  if (stepIndex.value === 2) {
    stepIndex.value = 1
  } else if (stepIndex.value === 3) {
    stepIndex.value = 2
  } else if (stepIndex.value === 4) {
    stepIndex.value = 3
  }
}
</script>

<style module="setup" lang="scss">
.setup {
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  padding: 24px 32px 0;
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

  svg {
    width: 178px;
    height: 36px;
  }

  h1 {
    margin: 0 0 0 19px;
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
  overflow-y: scroll;
  background: rgb(255 255 255 / 60%);
  border: 1px solid #fff;
  border-radius: 20px 20px 0 0;

  &::-webkit-scrollbar {
    width: 5px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgb(255 255 255 / 30%);
  }
}

.steps {
  display: flex;
  flex-direction: row;
  margin: 0;
  margin-bottom: 24px;
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
  color: #585b58;
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

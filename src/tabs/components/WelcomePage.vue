<template>
  <div :class="setup.setup">
    <div :class="setup.title">
      <IconLogoAndText />
      <h1>Opensource | AI Assistant on All Websites</h1>
    </div>
    <main :class="setup.main">
      <div :class="setup.form">
        <ul :class="setup.steps">
          <li
            v-for="(item, index) in steps"
            :key="index"
            :class="{[setup.stepItem]: true, [setup.stepItemActive]: stepIndex === item}"
          >
            {{ item }}
          </li>
        </ul>
        <div :class="setup.infoInputArea">
          <!-- Step One -->
          <!-- <StepOne v-if="stepIndex === 1" :skip="handleSkip" /> -->
          <!-- Setp Two -->
          <StepTwo v-if="stepIndex === 2" v-model="authInfo" />
          <!-- Setp Three -->
          <StepThree v-else-if="stepIndex === 3" />
          <!-- Setp Four -->
          <StepFour v-else-if="stepIndex === 4" />
          <!-- NEXT BUTTON -->
          <div :class="setup.btnGroup">
            <WebpilotButton
              v-if="stepIndex > 1"
              type="ghost"
              value="BACK"
              @click="handleGoBackBtn"
            />
            <WebpilotButton
              v-if="stepIndex !== 1"
              :disalbed="buttonDisabled"
              :loading="loading"
              :value="stepIndex === 4 ? 'DONE' : 'NEXT'"
              @click="handleNextBtn"
            />
          </div>
          <div :class="setup.warn">
            <WebpilotAlert v-if="showWarn" :tips="errorMessage" :type="'error'" />
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

import {ref, computed} from 'vue'
// import {useToast} from 'vue-toast-notification'
// import 'vue-toast-notification/dist/theme-sugar.css'
// import 'vue-toast-notification/dist/theme-bootstrap.css'

import useStore from '@/stores/store'
import useUserStore from '@/stores/user'
import {WEBPILOT_OPENAI} from '@/config'

import IconLogoAndText from '@/components/icon/IconLogoAndText.vue'
import WebpilotButton from '@/components/WebpilotButton.vue'
import WebpilotAlert from '@/components/WebpilotAlert.vue'
import useAskAi from '@/hooks/useAskAi'

// import StepOne from './StepOne.vue'
import StepTwo from './StepTwo.vue'
import StepThree from './StepThree.vue'
import StepFour from './StepFour.vue'

const steps = [1, 2, 3, 4]
const showWarn = ref(false)

const userStore = useUserStore()
const {getUser} = userStore
getUser()

// const toast = useToast()
const storeConfig = useStore()

const {loading, askAi, errorMessage} = useAskAi()

/** Step Index */
const stepIndex = ref(2)

/** AuthInfo */
const authInfo = ref({
  authKey: storeConfig.config.authKey,
  selfHostUrl: storeConfig.config.selfHostUrl,
  selectedOption: storeConfig.config.apiOrigin,
})

const buttonDisabled = computed(() => {
  return (
    stepIndex.value === 2 && authInfo.value.selectedOption === 'personal' && !authInfo.value.authKey
  )
})

const checkAuthKey = async () => {
  const {selectedOption} = authInfo.value
  let {authKey, selfHostUrl} = authInfo.value

  if (selectedOption === 'general') {
    authKey = WEBPILOT_OPENAI.AUTH_KEY
    selfHostUrl = WEBPILOT_OPENAI.HOST_URL
  }

  await storeConfig.setConfig({
    ...storeConfig.config,
    apiOrigin: selectedOption,
  })

  // check toekn and self host change
  // if (authKey === storeConfig.config.authKey && selfHostUrl === storeConfig.config.selfHostUrl) {
  //   stepIndex.value = 3
  //   return
  // }

  try {
    await askAi({
      authKey,
      command: 'Say hi.',
      url: selfHostUrl === '' ? null : selfHostUrl,
    })

    // 选择 Free API时，authKey 和 selfHostUrl 用于占位，不更新 store
    if (selectedOption === 'general') {
      storeConfig.setConfig({
        ...storeConfig.config,
        isAuth: true,
        isFinishSetup: true,
        apiOrigin: selectedOption,
      })
    } else {
      storeConfig.setConfig({
        ...storeConfig.config,
        isAuth: true,
        isFinishSetup: true,
        apiOrigin: selectedOption,
        authKey,
        selfHostUrl,
      })
    }
    stepIndex.value = 3
  } catch (error) {
    showWarn.value = true

    if (error?.response?.status === 402) {
      storeConfig.setConfig({
        ...storeConfig.config,
        isAuth: true,
        isFinishSetup: true,
      })

      setTimeout(() => {
        stepIndex.value = 3
        showWarn.value = false
      }, 600)
    }

    // toast.open({
    //   message: 'Incorrect API Key. Please check with the provider',
    //   type: 'error',
    //   position: 'top',
    // })
  }
}

const handleNextBtn = async () => {
  if (stepIndex.value === 2) {
    await checkAuthKey()
    // stepIndex.value++
  } else if (stepIndex.value === 3) {
    stepIndex.value++
  } else if (stepIndex.value === 4) {
    window.close()
  }
}

const handleGoBackBtn = () => {
  if (stepIndex.value === 2) {
    chrome.tabs.goBack()
  } else {
    stepIndex.value -= 1
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
    color: #585b58;
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
  overflow-y: auto;
  background: rgb(255 255 255 / 60%);
  border: 1px solid #fff;
  border-radius: 20px 20px 0 0;

  &::-webkit-scrollbar {
    width: 10px;
    height: 26px;
  }

  /* Background color of the scrollbar track */
  &::-webkit-scrollbar-track {
    background: linear-gradient(0deg, rgb(79 90 255 / 20%), rgb(79 90 255 / 20%)), #fff;
    border-radius: 2px 2px 0 0;
  }

  /* Color of the scrollbar thumb */
  &::-webkit-scrollbar-thumb {
    background: linear-gradient(0deg, rgb(79 90 255 / 40%), rgb(79 90 255 / 40%)), #fff;
    border-radius: 5px;
  }

  /* Hover state of the scrollbar thumb */
  &::-webkit-scrollbar-thumb:hover {
    /* background-color: #555; */
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

.warn {
  margin-top: 20px;
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

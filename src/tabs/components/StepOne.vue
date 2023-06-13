<template>
  <div :class="stepOne.wrap">
    <h3>Create Webpilot account</h3>
    <p>To unlock all features, we highly recommend you to sign in</p>
    <div :class="stepOne.button">
      <a :class="stepOne.signin" @click="openSignIn()">Sign in with Google</a>
      <!-- <a :class="stepOne.skip" @click="skip">SKIP FOR NOW</a> -->
    </div>
    <div v-if="showMask" :class="stepOne.mask"></div>
  </div>
</template>

<script setup>
import {ref} from 'vue'
import {Storage} from '@plasmohq/storage'

import useUserStore from '@/stores/user'
import {GOOGLE_CREDENTIAL} from '@/apiConfig'

const storage = new Storage()
const userStore = useUserStore()
const {getUser} = userStore
const props = defineProps({
  skip: {
    type: Function,
    required: true,
    default: () => {},
  },
})

const showMask = ref(false)

const openSignIn = () => {
  const width = 480
  const height = 624

  const screenWidth = window.screen.availWidth
  const screenHeight = window.screen.availHeight

  const left = Math.round((screenWidth - width) / 2)
  const top = Math.round((screenHeight - height) / 2)

  chrome.windows.create(
    {
      url: 'https://account.webpilot.ai/',
      type: 'popup',
      left,
      top,
      width,
      height,
    },
    function (newWindow) {
      const newWindowId = newWindow.id
      showMask.value = true

      chrome.runtime.onMessage.addListener(function (request) {
        if (request.credential) {
          // Access the username sent from the webpage
          const {credential} = request
          showMask.value = false
          storage.set(GOOGLE_CREDENTIAL, credential)
          // Do something with the username in the extension
          props.skip()
          getUser()
          chrome.windows.remove(newWindowId)
        }
      })

      chrome.windows.onRemoved.addListener(function (closedWindowId) {
        if (closedWindowId === newWindowId) {
          showMask.value = false
        }
      })
    }
  )
  // chrome.tabs.create({url: 'https://account.webpilot.ai/'}, tab => {
  //   const tabId = tab.id

  //   chrome.runtime.onMessage.addListener(function (request) {
  //     if (request.credential) {
  //       // Access the username sent from the webpage
  //       const {credential} = request
  //       storage.set(GOOGLE_CREDENTIAL, credential)
  //       // Do something with the username in the extension
  //       props.skip()
  //       getUser()
  //       chrome.tabs.remove(tabId)
  //     }
  //   })
  // })
}
</script>

<style module="stepOne" lang="scss">
.wrap {
  h3 {
    margin: 0 0 16px;
    font-weight: 400;
    font-size: 24px;
    line-height: 34px;
    text-align: center;
    background-image: url('../images/logo.png');
    background-repeat: no-repeat;
    background-position: 40px 50%;
    background-size: 24px 24px;
  }

  p {
    font-size: 14px;
    line-height: 20px;
    text-align: center;
  }
}

.button {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 72px 0 0;

  .signin {
    display: inline-block;
    width: 170px;
    height: 40px;
    margin: 0 0 24px;
    padding: 0;
    line-height: 40px;
    text-align: center;
    text-indent: -9999px;
    background: #f8faff;
    background-image: url('../images/signin-google.png');
    background-repeat: no-repeat;
    background-position: 50% 50%;
    background-size: 154px 20px;
    border: 1px solid #d2e3fc;
    border-radius: 5px;
    cursor: pointer;
  }

  .signin:hover {
    /* filter: drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.109969)) */

    /* drop-shadow(0px 5px 15px rgba(0, 0, 0, 0.0794837)); */
    box-shadow: 0 2px 4px 0 rgb(0 0 0 / 11%), 0 5px 15px 0 rgb(0 0 0 / 8%);
  }

  .signin:active {
    border: 1px solid;
    border-image-source: linear-gradient(0deg, rgb(0 0 0 / 40%), rgb(0 0 0 / 40%)),
      linear-gradient(0deg, #4f5aff, #4f5aff);
  }
}

.skip {
  display: inline-block;
  width: 172px;
  padding: 8px 16px;
  text-align: center;
  background: #fff;
  border: 1px solid rgb(79 90 255 / 20%);
  border-radius: 4px;
  cursor: pointer;
}

.mask {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgb(0 0 0 / 60%);
}
</style>

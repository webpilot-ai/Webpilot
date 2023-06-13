<template>
  <div :class="account.main">
    <div v-if="!isSignedIn" :class="account.loggedout">
      <div :class="account.panel">
        <div :class="account.intro">
          <p>To unlock all features including Webpilot FREE API</p>
          <p>we highly recommend you to sign in</p>
        </div>
        <div :class="account.signIn">
          <a :class="account.button" @click="openSignIn()">Sign in with Google</a>
        </div>
      </div>
    </div>
    <div v-else :class="account.signedIn">
      <div :class="[account.panel, account.profile]">
        <h3>Linked Account</h3>
        <p>
          {{ user }}
          <a @click="signOut()">UNLINK</a>
        </p>
      </div>
      <div v-if="false" :class="[account.panel, account.plan]">
        <h3>Your Plan</h3>
      </div>
    </div>
    <div v-if="showMask" :class="account.mask"></div>
  </div>
</template>

<script setup>
import {ref} from 'vue'
import {Storage} from '@plasmohq/storage'
import {storeToRefs} from 'pinia'

import useUserStore from '@/stores/user'

import {GOOGLE_CREDENTIAL} from '@/apiConfig'

const storage = new Storage()

const userStore = useUserStore()
const {user, isSignedIn} = storeToRefs(userStore)
const {getUser} = userStore

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
  //       getUser()
  //       // Do something with the username in the extension
  //       chrome.tabs.remove(tabId)
  //     }
  //   })
  // })
}

const signOut = () => {
  storage.remove(GOOGLE_CREDENTIAL)
  getUser()
}
</script>

<style module="account" lang="scss">
.panel {
  margin-bottom: 20px;
  padding: 16px 24px;
  background-color: #fff;
  border-radius: 10px;

  h3 {
    margin: 0;
    color: #4f5aff;
    font-weight: 400;
    font-size: 24px;
    line-height: 34px;
  }
}

.loggedout {
  .panel {
    height: 354px;
    background-image: url('./images/bg-signin.png');
    background-repeat: no-repeat;
    background-position: 50% 50px;
    background-size: 176px;
  }
}

.intro {
  padding: 185px 0 0;

  p {
    margin: 0;
    font-size: 14px;
    line-height: 20px;
    text-align: center;
  }
}

.signIn {
  margin: 36px 0 0;
  text-align: center;

  .button {
    display: inline-block;
    width: 170px;
    height: 40px;
    margin: 0 0 24px;
    padding: 0;
    line-height: 40px;
    text-align: center;
    text-indent: -9999px;
    background: #f8faff;
    background-image: url('../tabs/images/signin-google.png');
    background-repeat: no-repeat;
    background-position: 50% 50%;
    background-size: 154px 20px;
    border: 1px solid #d2e3fc;
    border-radius: 5px;
    cursor: pointer;
  }

  .button:hover {
    /* filter: drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.109969)) */

    /* drop-shadow(0px 5px 15px rgba(0, 0, 0, 0.0794837)); */
    box-shadow: 0 2px 4px 0 rgb(0 0 0 / 11%), 0 5px 15px 0 rgb(0 0 0 / 8%);
  }

  .button:active {
    border: 1px solid;
    border-image-source: linear-gradient(0deg, rgb(0 0 0 / 40%), rgb(0 0 0 / 40%)),
      linear-gradient(0deg, #4f5aff, #4f5aff);
  }
}

.profile {
  p {
    padding: 0 36px;
    color: #585b58;
    font-size: 14px;
    line-height: 25px;
    background-image: url('./images/g-logo.png');
    background-repeat: no-repeat;
    background-position: 0 0;
    background-size: 24px 25px;
  }

  a {
    margin-left: 24px;
    color: #585b58;
    text-decoration: underline;
    cursor: pointer;
  }

  a:hover {
    color: #4f5aff;
  }

  a:active {
    color: #292f8e;
  }
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

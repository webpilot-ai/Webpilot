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
    <div v-else :class="account.loggedin">
      <div :class="[account.panel, account.profile]">
        <h3>Linked Account</h3>
        <p>{{ user }}</p>
      </div>
      <div :class="[account.panel, account.plan]">
        <h3>Your Plan</h3>
      </div>
    </div>
  </div>
</template>

<script setup>
import {Storage} from '@plasmohq/storage'
import {storeToRefs} from 'pinia'

import useUserStore from '@/stores/user'

import {GOOGLE_CREDENTIAL} from '@/apiConfig'

const storage = new Storage()

const userStore = useUserStore()
const {user, isSignedIn} = storeToRefs(userStore)
const {getUser} = userStore

const openSignIn = () => {
  chrome.tabs.create({url: 'http://localhost/'}, tab => {
    const tabId = tab.id

    chrome.runtime.onMessage.addListener(function (request) {
      if (request.credential) {
        // Access the username sent from the webpage
        const {credential} = request
        storage.set(GOOGLE_CREDENTIAL, credential)
        getUser()
        // Do something with the username in the extension
        console.log(`Credential received: ${credential}`)
        chrome.tabs.remove(tabId)
      }
    })
  })
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
    width: 172px;
    height: 42px;
    padding: 0;
    text-indent: -9999px;
    background-image: url('./images/sign-in-with-google.png');
    background-repeat: no-repeat;
    background-size: contain;
    cursor: pointer;
  }
}

.title {
  margin-bottom: 8px;
  color: #292929;
  font-size: 18px;
  line-height: 25px;
}

.persons {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 16px;
}
</style>

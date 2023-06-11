<template>
  <div :class="stepOne.wrap">
    <h3>Create Webpilot account</h3>
    <p>To unlock all features, we highly recommend you to sign in</p>
    <div :class="stepOne.button">
      <a :class="stepOne.signin" @click="openSignIn()">Sign in with Google</a>
      <a :class="stepOne.skip" @click="skip">SKIP FOR NOW</a>
    </div>
  </div>
</template>

<script setup>
import {defineProps} from 'vue'
import {Storage} from '@plasmohq/storage'

import {GOOGLE_CREDENTIAL} from '@/apiConfig'

const storage = new Storage()

const props = defineProps({
  skip: {
    type: Function,
    required: true,
    default: () => {},
  },
})

const openSignIn = () => {
  chrome.tabs.create({url: 'http://localhost/'}, tab => {
    const tabId = tab.id

    chrome.runtime.onMessage.addListener(function (request) {
      if (request.credential) {
        // Access the username sent from the webpage
        const {credential} = request
        storage.set(GOOGLE_CREDENTIAL, credential)
        // Do something with the username in the extension
        console.log(`Credential received: ${credential}`)
        props.skip()
        chrome.tabs.remove(tabId)
      }
    })
  })
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
    width: 172px;
    height: 42px;
    margin: 0 0 24px;
    padding: 0;
    text-indent: -9999px;
    background-image: url('../../options/images/sign-in-with-google.png');
    background-repeat: no-repeat;
    background-size: contain;
    cursor: pointer;
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
}
</style>

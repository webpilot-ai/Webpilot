<template>
  <div :class="account.main">
    <div>
      <div :class="account.intro">
        <p>To unlock all features including Webpilot FREE API</p>
        <p>we highly recommend you to sign in</p>
      </div>
      <div class="button"></div>
    </div>
  </div>
</template>

<script setup>
import {onMounted} from 'vue'

// let { donate} = {}

// const ABOUT_API = 'https://raw.githubusercontent.com/webpilot-ai/data/main/about_vue3.json'

onMounted(() => {
  // fetch(ABOUT_API)
  //   .then(res => res.json())
  //   .then(data => {
  //     return ({ donate} = data)
  //   })
})
</script>

<style module="account" lang="scss">
.main {
  margin-top: 20px;
  padding: 24px 16px;
  background-color: rgb(255 255 255 / 60%);
  border-radius: 10px;
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

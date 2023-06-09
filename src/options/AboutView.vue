<template>
  <div :class="about.main">
    <div v-for="(value, key) in persons" :key="key">
      <div :class="about.title">
        {{ key }}
      </div>
      <div :class="about.persons">
        <Contributor v-for="contributor in value" :key="contributor.name" :info="contributor" />
      </div>
    </div>

    <div :class="about.donate">
      <a :href="donate?.link" target="_black">
        {{ donate?.text }}
      </a>
    </div>
  </div>
</template>

<script setup>
import {onMounted} from 'vue'

import Contributor from './components/ContributorView.vue'

let {persons, donate} = {}

const ABOUT_API = 'https://raw.githubusercontent.com/webpilot-ai/data/main/about_vue3.json'

onMounted(() => {
  fetch(ABOUT_API)
    .then(res => res.json())
    .then(data => {
      return ({persons, donate} = data)
    })
})
</script>

<style module="about" lang="scss">
.main {
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

.donate {
  margin-top: -20px;
  color: #4f5aff;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  text-decoration-line: underline;

  a:visited {
    color: #4f5aff;
  }
}
</style>

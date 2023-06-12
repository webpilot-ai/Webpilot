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
import {ref, onMounted} from 'vue'

import Contributor from './components/ContributorView.vue'

const persons = ref([])
const donate = ref()

const ABOUT_API = 'https://raw.githubusercontent.com/webpilot-ai/data/main/about_vue3.json'

onMounted(() => {
  fetch(ABOUT_API)
    .then(res => res.json())
    .then(data => {
      persons.value = data.persons
      donate.value = data.donate
      // return ({persons, donate} = data)
    })
})
</script>

<style module="about" lang="scss">
.main {
  margin: 16px 0 0;
  padding: 0 4px;
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
  margin-right: -16px;
  margin-bottom: 32px;
}

.donate {
  margin-top: -32px;
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

<template>
  <div :class="index.container">
    <div :class="index.main">
      <!-- header -->
      <div :class="index.header">
        <div :class="index.logo">
          <img alt=" logog" src="./images/Text+Logo.svg" />
          <span :class="index.slogan">{{
            $gettext('Opensource AI Assistant On All Websites')
          }}</span>
        </div>
        <ul :class="index.tabs">
          <li
            :class="[index.tab, active == 'advanced' ? index.active : '']"
            @click="active = 'advanced'"
          >
            {{ $gettext('Advanced') }}
          </li>
          <li :class="[index.tab, active == 'about' ? index.active : '']" @click="active = 'about'">
            {{ $gettext('About') }}
          </li>
        </ul>
      </div>

      <!-- body -->
      <div :class="index.body">
        <AdvancedView v-show="active == 'advanced'" />

        <AboutView v-show="active == 'about'" />
      </div>

      <!-- footer -->
      <div :class="index.footer">
        <span>{{ $gettext('Webpilot is open source') }}</span>
        <a href="https://github.com/Fluentify-IO/Fluentify" rel="noreferrer" target="_blank">
          {{ $gettext('Star on Github') }}
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import '@assets/styles/reset.scss'
import {ref} from 'vue'

import AdvancedView from './AdvancedView.vue'
import AboutView from './AboutView.vue'

const active = ref('advanced')
</script>

<style module="index" lang="scss">
.container {
  display: flex;
  justify-content: center;
  width: 100%;
  height: 100vh;
  background: linear-gradient(150.76deg, #efdaff 12.93%, #b28aff 64.87%, #6f63ff 108.73%);
}

.main {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: calc(100vw - 18px);
  max-width: 1438px;
  margin-top: 18px;
  padding: 24px;
  overflow-y: scroll;
  background: rgb(255 255 255 / 60%);
  border: 1px solid #fff;
  border-radius: 20px 20px 0 0;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-button {
    display: none;
  }

  .body {
    justify-content: flex-start;
  }
}

.logo {
  display: flex;
  flex-direction: row;

  img {
    margin-right: 24px;
  }

  .slogan {
    display: flex;
    align-items: center;
    margin-top: 7px;
    color: #777;
    font-weight: 400;
    font-size: 18px;
    font-style: normal;
    line-height: 25px;
  }
}

@media (width <= 820px) {
  .slogan {
    display: none;
  }
}

.footer {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  line-height: 25px;

  span {
    margin-top: 32px;
    color: #929497;
  }

  a {
    color: #4f5aff;
    text-decoration: none;
  }
}

.tabs {
  display: flex;
  flex-direction: row;
  margin-top: 33px;
  margin-bottom: 0;
  padding-left: 20px;
  font-weight: 600;
  font-size: 24px;
  line-height: 34px;
  list-style: none;
  padding-inline-start: 24px;
}

li + li {
  margin-left: 48px;
}

.tab {
  border-bottom: 4px solid rgb(255 255 255 / 0%);
  cursor: pointer;
}

.active {
  color: #4f5aff;
  border-bottom: 4px solid #4f5aff;
}
</style>

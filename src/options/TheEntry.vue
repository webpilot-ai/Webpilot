<template>
  <div :class="index['setting-page-wrap']">
    <nav :class="index['setting-nav']">
      <IconLogoWithText :class="index['setting-nav-logo']" />
      <IconLogoWithTextDark :class="index['setting-nav-logo-dark']" />
      <NavItem
        :activated="activatedTab === TabList.Account"
        :name="TabList.Account"
        @change="onChangeTab"
      />
      <NavItem
        :activated="activatedTab === TabList.Extension"
        :name="TabList.Extension"
        @change="onChangeTab"
      />
      <NavItem
        :activated="activatedTab === TabList.About"
        :name="TabList.About"
        @change="onChangeTab"
      />
    </nav>
    <main :class="index.main">
      <component :is="currentComponent" />
    </main>
  </div>
</template>

<script setup>
import {computed, ref} from 'vue'
import {storeToRefs} from 'pinia'

import useStore from '@/stores/store'

import IconLogoWithText from './images/icon-logo-with-text.vue'
import IconLogoWithTextDark from './images/icon-logo-with-text-dark.vue'
import NavItem from './components/NavItem.vue'
import AccountView from './views/AccountView.vue'
import ExtensionView from './views/ExtensionView.vue'
import AboutView from './views/AboutView.vue'

// Start setup states check
const store = useStore()
const {config} = storeToRefs(store)

if (!config.value.isFinishSetup) {
  const signURL = 'https://account.webpilot.ai/'
  chrome.tabs.getCurrent(tab => {
    const tabId = tab.id
    chrome.tabs.update(tabId, {url: signURL})
  })
}
// End Setup states check

const TabList = {
  Account: 'Account',
  Extension: 'Extension',
  About: 'About',
}

const activatedTab = ref(TabList.Account)

const onChangeTab = tabName => {
  activatedTab.value = tabName
}

const currentComponent = computed(() => {
  if (activatedTab.value === TabList.About) return AboutView
  if (activatedTab.value === TabList.Extension) return ExtensionView
  return AccountView
})
</script>

<style module="index" lang="scss">
body {
  margin: 0;
}

.setting-page-wrap {
  display: grid;
  grid-template-columns: 240px 1fr;
  width: 100vw;
  height: 100vh;
}

.setting-nav {
  box-sizing: border-box;
  width: 240px;
  padding: 36px 12px;
  background-color: var(--color-nav-background-color);
}

.setting-nav-logo {
  margin-bottom: 57px;
  margin-left: 12px;
}

.setting-nav-logo-dark {
  display: none;
}

.main {
  padding: 36px 48px;
  padding-bottom: 14px;
  background-image: linear-gradient(
    to right,
    rgb(0 0 0 / 5%),
    var(--color-main-background-color) 36px,
    var(--color-main-background-color)
  );
}

@media (prefers-color-scheme: dark) {
  .main {
    background-color: var(--color-main-background-color);
    background-image: linear-gradient(
      to right,
      rgba(0 0 0 / 5%),
      var(--color-main-background-color) 36px,
      var(--color-main-background-color)
    );
  }

  .setting-nav-logo {
    display: none;
  }

  .setting-nav-logo-dark {
    display: block;
    margin-bottom: 57px;
    margin-left: 12px;
  }
}
</style>

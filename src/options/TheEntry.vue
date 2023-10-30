<template>
  <div :class="index['setting-page-wrap']">
    <nav :class="index['setting-nav']">
      <div :class="index['logo-with-text']">
        <IconLogoWithText :class="index['setting-nav-logo']" />
        <IconLogoWithTextDark :class="index['setting-nav-logo-dark']" />
      </div>
      <div :class="index['logo-only']"><IconLogo /></div>
      <NavItem
        :activated="activatedTab === OPTIONS_PAGE_TAB_NAME.ACCOUNT"
        :name="OPTIONS_PAGE_TAB_NAME.ACCOUNT"
        @change="onChangeTab"
      />
      <NavItem
        :activated="activatedTab === OPTIONS_PAGE_TAB_NAME.EXTENSION"
        :name="OPTIONS_PAGE_TAB_NAME.EXTENSION"
        @change="onChangeTab"
      >
        <template #outline><IconNavExtensionOutline /> </template>
        <template #filled><IconNavExtensionFilled /> </template>
      </NavItem>
      <NavItem
        :activated="activatedTab === OPTIONS_PAGE_TAB_NAME.ABOUT"
        :name="OPTIONS_PAGE_TAB_NAME.ABOUT"
        @change="onChangeTab"
      >
        <template #outline><IconNavAboutOutline /> </template>
        <template #filled><IconNavAboutFilled /> </template>
      </NavItem>
    </nav>
    <main :class="index.main">
      <component :is="currentComponent" />
    </main>
  </div>
</template>

<script setup>
import {computed, ref, onMounted} from 'vue'
import {storeToRefs} from 'pinia'
import {Storage} from '@plasmohq/storage'

import useStore from '@/stores/store'

import {OPTIONS_PAGE_TAB_NAME} from '@/config'

import IconLogo from './images/icon-logo.vue'
import IconLogoWithText from './images/icon-logo-with-text.vue'
import IconLogoWithTextDark from './images/icon-logo-with-text-dark.vue'
import IconNavExtensionFilled from './images/icon-nav-extension-filled.vue'
import IconNavExtensionOutline from './images/icon-nav-extension-outline.vue'
import IconNavAboutOutline from './images/icon-nav-about-outline.vue'
import IconNavAboutFilled from './images/icon-nav-about-filled.vue'
import NavItem from './components/NavItem.vue'
import AccountView from './views/AccountView.vue'
import ExtensionView from './views/ExtensionView.vue'
import AboutView from './views/AboutView.vue'

// Start setup states check
const store = useStore()
const {config} = storeToRefs(store)
const storage = new Storage()

if (!config.value.isFinishSetup) {
  const signURL = 'https://account.webpilot.ai/'
  chrome.tabs.getCurrent(tab => {
    const tabId = tab.id
    chrome.tabs.update(tabId, {url: signURL})
  })
}
// End Setup states check

const activatedTab = ref(OPTIONS_PAGE_TAB_NAME.ACCOUNT)
onMounted(async () => {
  const tabName = await storage.get('OPTIONS_PAGE_ACTIVATED_TAB')
  if (tabName && Object.keys(OPTIONS_PAGE_TAB_NAME).includes(tabName)) {
    activatedTab.value = tabName
    storage.set('OPTIONS_PAGE_ACTIVATED_TAB', null)
  }
})
const onChangeTab = tabName => {
  activatedTab.value = tabName
}
const currentComponent = computed(() => {
  if (activatedTab.value === OPTIONS_PAGE_TAB_NAME.ABOUT) return AboutView
  if (activatedTab.value === OPTIONS_PAGE_TAB_NAME.EXTENSION) return ExtensionView
  return AccountView
})
</script>

<style module="index" lang="scss">
body {
  min-width: 600px;
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

.logo-only {
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

@media only screen and (width <= 700px) {
  .main {
    width: 100%;
    padding: 36px 22px;
  }

  .setting-page-wrap {
    grid-template-columns: 56px 1fr;
  }

  .setting-nav {
    justify-self: center;
    width: 36px;
    padding: 0;
    padding-top: 16px;
  }

  .logo-with-text {
    display: none;
  }

  .logo-only {
    display: flex;
    justify-content: center;
    margin-bottom: 94px;

    svg {
      width: 24px;
      height: 24px;
    }
  }
}
</style>

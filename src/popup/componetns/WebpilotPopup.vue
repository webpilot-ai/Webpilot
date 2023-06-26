<template>
  <section :class="$style.notSupportPaeg">
    <HeaderPanel @on-close="closeWindow" />
    <section :class="$style.tipsWrap">
      <WebpilotAlert :tips="$gettext('Current Webpage Not Supported')" type="error">
      </WebpilotAlert>
    </section>
    <section :class="$style.explain">
      {{
        $gettext(
          "Due to Chrome's constraints, Webpilot cannot be activated on the following webpages:"
        )
      }}
      <ul role="list">
        <li>{{ $gettext("Chrome's Settings, History, and Web Store pages") }}</li>
        <li>{{ $gettext('New tab and blank pages') }}</li>
      </ul>
    </section>
    <TipsShortcut :class="$style.shortcut" />
  </section>
</template>

<script setup>
import '@assets/styles/reset.scss'

import {onBeforeMount} from 'vue'
import {sendToBackground} from '@plasmohq/messaging'

import {$gettext} from '@/utils/i18n'

import HeaderPanel from '@/components/HeaderPanel.vue'
import WebpilotAlert from '@/components/WebpilotAlert.vue'
import TipsShortcut from '@/components/TipsShortcut.vue'
import useStore from '@/stores/store'

const store = useStore()

onBeforeMount(async () => {
  // check welcode guide
  if (!store.config.isFinishSetup) {
    let result = await chrome?.tabs?.query({
      active: true,
      currentWindow: true,
    })

    result = Array.isArray(result) ? result[0] : result
    const {url: currentUrl} = result

    // can't get current open page url
    if (currentUrl === undefined) return

    const signURL = 'https://account.webpilot.ai/'
    const welcomeUrl = chrome?.runtime?.getURL('tabs/index.html')

    // aready in welcome page
    if (currentUrl === signURL || currentUrl === welcomeUrl) {
      closeWindow()
      return
    }

    chrome.tabs.create({url: signURL})
    closeWindow()
    // window.open(welcomeUrl)
    return
  }

  // check auth state
  if (!store.config.isAuth) {
    sendToBackground({name: 'openSetting'})
    closeWindow()
    return
  }

  // check current page
  const isKeepOpen = await sendToBackground({
    name: 'popupCheck',
  })

  if (!isKeepOpen) window.close()
})

const closeWindow = () => {
  window.close()
}
</script>
<style module lang="scss">
.notSupportPaeg {
  position: relative;
  box-sizing: border-box;
  width: 480px;
  padding: 16px;
  padding-bottom: 24px;
}

.tipsWrap {
  margin-top: 8px;
}

.explain {
  margin-top: 8px;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;

  ul {
    margin: 0;
    padding-left: 20px;
    list-style-type: disc !important;
  }

  li {
    margin: 0;
  }
}

.shortcut {
  position: absolute;
  right: 16px;
  bottom: 16px;
}
</style>

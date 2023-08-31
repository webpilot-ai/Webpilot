import {ref} from 'vue'
import {defineStore} from 'pinia'

import {Storage} from '@plasmohq/storage'

import {getUser as getUserInfo, getAPIUsage} from '@/apiService'
import {defaultConfig} from '@/config'
import {GOOGLE_CREDENTIAL} from '@/apiConfig'

import useStore from './store'

const useUserStore = defineStore('user', () => {
  const user = ref(null)
  const isSignedIn = ref(false)
  const usage = ref({current: -1, total: 50, percent: '0'})

  async function getUser() {
    const response = await getUserInfo()

    user.value = response.email
    isSignedIn.value = response.isSignedIn
  }

  async function getUsage() {
    const response = await getAPIUsage()
    const {current, total} = response
    // const {current, total} = {current: 36, total: 50}
    const percent = `${(current / total) * 100}%`
    // const percent = '36%'

    usage.value = {current, total, percent}
  }

  function unlink() {
    const store = useStore()
    const storage = new Storage()

    // remove google credential
    storage.set(GOOGLE_CREDENTIAL, '')

    // reset config
    store.updateConfig(defaultConfig)

    // go init page page
    const signURL = 'https://account.webpilot.ai/'
    chrome.tabs.create({url: signURL})
  }

  return {user, isSignedIn, getUser, usage, getUsage, unlink}
})

export default useUserStore

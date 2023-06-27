import {ref} from 'vue'
import {defineStore} from 'pinia'

import {getUser as getUserInfo, getAPIUsage} from '@/apiService'

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

  return {user, isSignedIn, getUser, usage, getUsage}
})

export default useUserStore

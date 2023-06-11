import {ref} from 'vue'
import {defineStore} from 'pinia'

import {getUser as getUserInfo, getAPIUsage} from '@/apiService'

const useUserStore = defineStore('user', () => {
  const user = ref(null)
  const isSignedIn = ref(false)
  const usage = ref({current: 0, total: 50})

  async function getUser() {
    const response = await getUserInfo()

    user.value = response.email
    isSignedIn.value = response.isSignedIn
  }

  async function getUsage() {
    const response = await getAPIUsage()
    const {current, total} = response

    usage.value = {current, total}
  }

  return {user, isSignedIn, getUser, usage, getUsage}
})

export default useUserStore

import {ref} from 'vue'
import {defineStore} from 'pinia'

import {getUser as getUserInfo} from '@/apiService'

const useUserStore = defineStore('user', () => {
  const user = ref(null)
  const isSignedIn = ref(false)

  async function getUser() {
    const response = await getUserInfo()

    user.value = response.email
    isSignedIn.value = response.isSignedIn
  }

  return {user, isSignedIn, getUser}
})

export default useUserStore

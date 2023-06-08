import {ref} from 'vue'
import {defineStore} from 'pinia'

export const useUserStore = defineStore('user', () => {
  const user = ref(null)
  const isLoggedIn = ref(false)

  function getUser(value) {
    // TODO: get user info from server
    user.value = value
    isLoggedIn.value = true
  }

  return {user, isLoggedIn, getUser}
})

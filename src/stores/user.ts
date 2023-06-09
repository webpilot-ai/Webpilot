import {ref} from 'vue'
import {defineStore} from 'pinia'

const useUserStore = defineStore('user', () => {
  const user = ref(null)
  const isLoggedIn = ref(false)

  function getUser() {
    // TODO: get user info from server
    setTimeout(() => {
      user.value = 'OpenAI'
      isLoggedIn.value = true
    }, 1500)
  }

  return {user, isLoggedIn, getUser}
})

export default useUserStore

import {ref} from 'vue'
import {defineStore} from 'pinia'

export const useAPIStore = defineStore('API', () => {
  // 'general' | 'personal'
  const APIOrigin = ref('general')

  function getOrigin(value) {
    // TODO: get API origin
    APIOrigin.value = value
  }

  function setOrigin(value) {
    // TODO: set API origin
    APIOrigin.value = value
  }

  return {APIOrigin, getOrigin, setOrigin}
})

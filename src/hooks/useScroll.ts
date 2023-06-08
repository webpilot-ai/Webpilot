import {onUnmounted, ref, watch} from 'vue'

import {getAllScrollableParents} from '@/utils'

export default function useScroll(element, target) {
  const offsetY = ref(0)

  let originY = 0
  let scrollableElements = []

  const getScrollYOffset = () => {
    const targetElement = target.value
    const {y} = targetElement.getBoundingClientRect()
    offsetY.value = y - originY
  }

  const addListeners = () => {
    scrollableElements.forEach(item => {
      item.addEventListener('scroll', getScrollYOffset)
    })
  }

  const removeListeners = () => {
    scrollableElements.forEach(item => {
      item.removeEventListener('scroll', getScrollYOffset)
    })
    scrollableElements = []
  }

  watch(element, newValue => {
    if (newValue) {
      const targetElement = target.value

      if (!targetElement?.getBoundingClientRect) return

      resetScroll()
      // get all scrollable parents
      scrollableElements = getAllScrollableParents(targetElement)

      const {y} = targetElement.getBoundingClientRect()

      originY = y || 0

      addListeners()
    } else {
      removeListeners()
    }
  })

  onUnmounted(() => {
    removeListeners()
  })

  const resetScroll = () => {
    const {y} = target.value.getBoundingClientRect()
    originY = y
    offsetY.value = 0
  }

  return {offsetY, resetScroll}
}

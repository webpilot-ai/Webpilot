import {onUnmounted, ref, watch} from 'vue'

export default function useScroll(element) {
  const originScrollY = ref(0)
  const scrollYOffset = ref(0)

  const getScrollY = () => {
    scrollYOffset.value = originScrollY.value - window.scrollY
  }

  watch(element, newValue => {
    if (newValue) {
      scrollYOffset.value = 0
      originScrollY.value = window.scrollY
      document.addEventListener('scroll', getScrollY)
    } else {
      originScrollY.value = 0
      document.removeEventListener('scroll', getScrollY)
    }
  })

  onUnmounted(() => {
    document?.removeEventListener('scroll', getScrollY)
  })

  return {scrollYOffset}
}

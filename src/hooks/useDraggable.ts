import {ref, watch, onMounted, onUnmounted} from 'vue'

export default function useDraggable(element, stopListen) {
  const originPosition = {x: 0, y: 0}
  const lastOffset = {x: 0, y: 0}
  const offsetX = ref(0)
  const offsetY = ref(0)

  const handleMousemove = e => {
    const {clientX: x, clientY: y} = e
    const currentOffsetX = x - originPosition.x
    const currentOffsetY = y - originPosition.y

    offsetX.value = currentOffsetX + lastOffset.x
    offsetY.value = currentOffsetY + lastOffset.y
  }

  const startListenMove = e => {
    originPosition.x = e.clientX
    originPosition.y = e.clientY

    document.addEventListener('mousemove', handleMousemove)
    document.addEventListener('mouseup', () => {
      lastOffset.x = offsetX.value
      lastOffset.y = offsetY.value
      document.removeEventListener('mousemove', handleMousemove)
    })
  }

  onMounted(() => {
    element.value.addEventListener('mousedown', startListenMove)
  })

  onUnmounted(() => {
    element.value.removeEventListener('mousedown', startListenMove)
  })

  watch(stopListen, newValue => {
    if (!newValue) {
      document.removeEventListener('mousemove', handleMousemove)
    }
  })

  const resetDrag = () => {
    originPosition.x = 0
    originPosition.y = 0
    lastOffset.x = 0
    lastOffset.y = 0
    offsetX.value = 0
    offsetY.value = 0
  }

  return {offsetX, offsetY, resetDrag}
}

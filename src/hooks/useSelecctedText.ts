import {ref, onMounted, onUnmounted, reactive} from 'vue'

export default function useSelectedText(stopUpdate, updateText) {
  const selectedText = ref('')
  const mouseUpPosition = reactive({
    x: null,
    y: null,
  })
  const handleMouseUp = event => {
    if (stopUpdate.value) return

    setTimeout(() => {
      selectedText.value = window.getSelection().toString()?.trim()

      updateText(selectedText.value)
      if (selectedText.value === '') return

      mouseUpPosition.x = event.clientX
      mouseUpPosition.y = event.clientY
    }, 10)
  }

  onMounted(() => {
    document.addEventListener('mouseup', handleMouseUp)
  })

  onUnmounted(() => {
    document.removeEventListener('mouseup', handleMouseUp)
  })

  return {
    selectedText,
    mouseUpPosition,
  }
}

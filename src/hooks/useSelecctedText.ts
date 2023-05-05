import {ref, onMounted, onUnmounted, reactive} from 'vue'

export default function useSelectedText() {
  const selectedText = ref('')
  const mouseUpPosition = reactive({
    x: null,
    y: null,
  })
  const handleMouseUp = event => {
    setTimeout(() => {
      selectedText.value = window.getSelection().toString()

      if (selectedText.value === '') return

      mouseUpPosition.x = event.pageX
      mouseUpPosition.y = event.pageY
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

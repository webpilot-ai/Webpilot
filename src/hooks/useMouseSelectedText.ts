import {ref, onMounted, onUnmounted, reactive} from 'vue'

export default function useMouseSelectedText(onChange) {
  const selectedText = ref('')
  const mouseUpPosition = reactive({
    x: null,
    y: null,
  })
  const handleMouseUp = event => {
    setTimeout(() => {
      selectedText.value = window.getSelection().toString()?.trim()
      mouseUpPosition.x = event.clientX
      mouseUpPosition.y = event.clientY

      onChange({
        selectedText: selectedText.value,
        position: {
          x: mouseUpPosition.x,
          y: mouseUpPosition.y,
        },
      })
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

import {ref, onMounted, onUnmounted, reactive} from 'vue'

import {getRectFromInputAndTextarea} from '@/utils'

export default function useMouseSelectedText(onChange) {
  const selectedText = ref('')
  const tailPosition = reactive({
    x: null,
    y: null,
  })

  const handleMouseUp = () => {
    setTimeout(() => {
      const selection = window.getSelection()
      selectedText.value = selection.toString()?.trim()

      let x = 0
      let y = 0

      if (selection.rangeCount > 0 && selectedText.value.length > 0) {
        // is selected element is textarea
        if (selection.anchorNode === selection.focusNode) {
          const node = selection.anchorNode.childNodes[selection.anchorOffset]

          if (node instanceof HTMLTextAreaElement || node instanceof HTMLInputElement) {
            const rect = getRectFromInputAndTextarea(node)
            x = rect.left
            y = rect.bottom
          }
        } else {
          const rect = selection.getRangeAt(0).getBoundingClientRect()
          x = rect.left
          y = rect.bottom
        }
      }

      // update data
      tailPosition.x = x
      tailPosition.y = y

      onChange({
        selectedText: selectedText.value,
        position: {x, y},
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
    tailPosition,
  }
}

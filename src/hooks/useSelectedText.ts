import {ref, onMounted, onUnmounted, reactive, watch} from 'vue'
import {useMagicKeys} from '@vueuse/core'

import {getRectFromInputAndTextarea} from '@/utils'

export default function useSelectedText(onChange) {
  const selectedText = ref('')
  const tailPosition = reactive({
    x: null,
    y: null,
  })
  const targetElement = ref(null)

  // keyboard part
  const {Ctrl_A, backspace} = useMagicKeys()

  watch(Ctrl_A, v => {
    if (!v) return
    checkSelectedText()
  })

  watch(backspace, v => {
    if (!v) return
    checkSelectedText()
  })

  // mouse part
  onMounted(() => {
    document.addEventListener('mouseup', checkSelectedText)
  })

  onUnmounted(() => {
    document.removeEventListener('mouseup', checkSelectedText)
  })

  // generic
  const checkSelectedText = () => {
    setTimeout(() => {
      const selection = window.getSelection()
      selectedText.value = selection.toString()?.trim()

      let x = 0
      let y = 0

      const {focusNode} = selection
      if (focusNode) {
        targetElement.value =
          focusNode.nodeType === Node.ELEMENT_NODE ? focusNode : focusNode?.parentElement
      } else {
        targetElement.value = null
      }

      if (selection.rangeCount > 0 && selectedText.value.length > 0) {
        // is selected element is textarea
        const node = selection.anchorNode.childNodes[selection.anchorOffset]
        if (
          selection.anchorNode === selection.focusNode &&
          (node instanceof HTMLTextAreaElement || node instanceof HTMLInputElement)
        ) {
          const rect = getRectFromInputAndTextarea(node)
          x = rect.left
          y = rect.bottom
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
        targetElement,
      })
    }, 10)
  }

  return {
    selectedText,
    tailPosition,
    targetElement,
  }
}

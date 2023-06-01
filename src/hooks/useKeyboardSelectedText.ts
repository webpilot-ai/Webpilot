import {reactive, ref, watch} from 'vue'
import {useMagicKeys} from '@vueuse/core'

import {getRectFromInputAndTextarea} from '@/utils'

export default function useKeyboardSelectText(onChange) {
  const selectedText = ref('')
  const position = reactive({x: 0, y: 0})

  function resetPosition() {
    position.x = 0
    position.y = 0
  }

  const keys = useMagicKeys()
  const selectShortcut = keys['Ctrl+A']

  watch(selectShortcut, v => {
    if (!v) return

    setTimeout(() => {
      const selection = window.getSelection()
      const text = selection.toString()

      if (selection.type !== 'Range') return

      const node = selection.anchorNode.childNodes[selection.anchorOffset]

      if (node instanceof HTMLTextAreaElement || node instanceof HTMLInputElement) {
        const rect = getRectFromInputAndTextarea(node)

        position.x = rect.left
        position.y = rect.bottom

        selectedText.value = text
        onChange({
          position: {
            x: position.x,
            y: position.y,
          },
          selectedText: selectedText.value,
        })
      }
    })
  })

  return {
    selectedText,
    position,
    resetPosition,
  }
}

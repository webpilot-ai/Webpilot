import {reactive, ref, watch} from 'vue'
import {useMagicKeys} from '@vueuse/core'

export default function useKeyboardSelectText(updateText) {
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
        const {top, left} = node.getBoundingClientRect()
        const style = window.getComputedStyle(node)

        const {selectionEnd, selectionStart} = node

        const hiddenSpan = document.createElement('span')
        hiddenSpan.textContent = text
        hiddenSpan.style.whiteSpace = 'pre-wrap'
        hiddenSpan.style.visibility = 'hidden'
        hiddenSpan.style.position = 'fixed'
        hiddenSpan.style.top = `${top}px`
        hiddenSpan.style.left = `${left}px`
        hiddenSpan.style.width = style.width
        hiddenSpan.style.height = style.height
        hiddenSpan.style.margin = style.margin
        hiddenSpan.style.padding = style.padding
        hiddenSpan.style.fontFamily = style.fontFamily
        hiddenSpan.style.fontSize = style.fontSize
        hiddenSpan.style.lineHeight = style.lineHeight
        hiddenSpan.style.fontWeight = style.fontWeight
        hiddenSpan.style.borderTop = style.borderTop
        hiddenSpan.style.borderLeft = style.borderLeft
        hiddenSpan.style.borderRight = style.borderRight
        hiddenSpan.style.borderBottom = style.borderBottom
        hiddenSpan.style.backgroundColor = 'white'

        document.body.appendChild(hiddenSpan)

        // select hidden span
        const range = new Range()
        range.setStart(hiddenSpan.firstChild, selectionStart)
        range.setEnd(hiddenSpan.firstChild, selectionEnd)
        selection.removeAllRanges()
        selection.addRange(range)
        // get rect
        const rect = selection.getRangeAt(0).getBoundingClientRect()

        document.body.removeChild(hiddenSpan)
        node.setSelectionRange(selectionStart, selectionEnd)

        position.x = rect.left + rect.width / 2
        position.y = rect.bottom
        selectedText.value = text
        updateText(text)
      }
    })
  })

  return {
    selectedText,
    position,
    resetPosition,
  }
}

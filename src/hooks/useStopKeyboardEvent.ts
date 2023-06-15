import {watch} from 'vue'

export default function useStopKeyboardEvent(target) {
  function stopKeyboardEvent(keydownEvent) {
    keydownEvent.stopPropagation()
  }

  watch(target, (newTarget, oldTarget) => {
    if (newTarget) {
      newTarget.addEventListener('keydown', stopKeyboardEvent)
    } else {
      oldTarget.removeEventListener('keydown', stopKeyboardEvent)
    }
  })
}

import {watch} from 'vue'

export default function useClickOutside(element, onClickOutside) {
  const handleMouseClick = e => {
    const {target} = e

    if (!target.closest(`#${element.value.$el.id}`)) {
      onClickOutside()
    }
  }

  watch(element, newValue => {
    if (newValue?.$el) {
      document.addEventListener('mouseup', handleMouseClick)
    } else {
      document.removeEventListener('mouseup', handleMouseClick)
    }
  })
}

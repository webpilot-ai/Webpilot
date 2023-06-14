<!-- Just for test -->
<template>
  <h1></h1>
  <h2>{{ anchor }}</h2>
</template>

<script>
import {defineProps} from 'vue'

export const config = {
  matches: ['https://www.askjhdjksj.xmn/'],
}
// export const PlasmoCSUIAnchor = {type: 'overlay', element: document.body}
export const PlasmoCSUIAnchor = {
  type: 'inline',
  element: document.querySelector('#head_wrapper'),
}

const props = defineProps({
  anchor: {
    type: PlasmoCSUIAnchor,
    required: true,
  },
})

export const PlasmoGetInlineAnchor = async () => document.querySelector('#head_wrapper')

export default {
  plasmo: {PlasmoCSUIAnchor, props, PlasmoGetInlineAnchor},
}
</script>

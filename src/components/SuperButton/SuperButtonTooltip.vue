<template>
  <section :class="$style.container">
    <template v-if="!text">
      <div :class="$style.promptBlock" @click="handleEdit">
        <div :class="[$style.prompt, {[$style.prompt_hover]: hovered}]">
          {{ prompt }}
        </div>
        <img ref="hoverElement" :class="$style.edit" :src="icon" />
      </div>
    </template>
    <div v-else :class="$style.text">{{ text }}</div>

    <div :class="$style.triangle"></div>
  </section>
</template>

<script setup>
import {ref, computed} from 'vue'
import {useMousePressed, useElementHover} from '@vueuse/core'

import edit from 'data-url:./icon/edit.svg'
import editHover from 'data-url:./icon/editHover.svg'
import editActive from 'data-url:./icon/editActive.svg'

const emits = defineEmits(['edit'])

defineProps({
  text: {type: String, default: ''},
  prompt: {type: String, default: ''},
})

const hoverElement = ref()
const hovered = useElementHover(hoverElement)
const {pressed} = useMousePressed()

const icon = computed(() => {
  if (hovered.value && pressed.value) return editActive
  if (hovered.value) return editHover
  return edit
})

function handleEdit() {
  emits('edit')
}
</script>

<style lang="scss" module>
.container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 25px;
  padding: 0 4px;
  color: #292929;
  font-size: 12px;
  background-color: #fff;
  border: 1px solid #eeefff;
  border-radius: 4px;
}

.promptBlock {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #585b58;
  cursor: pointer;

  &:hover {
    color: #4f5aff;
  }
}

.prompt {
  min-width: 28px;
  max-width: 180px;
  margin-left: 4px;
  overflow: hidden;
  font-weight: 500;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.text {
  color: #292929;
  font-weight: 500;
  font-size: 12px;
}

.contentprompt_hover {
  color: #4f5aff;
}

.edit {
  width: 16px;
  height: 16px;
  margin-left: 5px;
  cursor: pointer;
  user-select: none;
  -webkit-user-drag: none;
  -moz-user-drag: none;
  -ms-user-drag: none;
}

.triangle {
  position: absolute;
  right: 6px;
  bottom: -5px;
  width: 12px;
  height: 6px;
  background-image: url('data-base64:./icon/triangle.png');
  background-size: cover;
}
</style>

<template>
  <section :class="$style.webpilotSuperButtonContainer">
    <section v-if="promptEditorVisible" :class="$style.promptEditor">
      <SuperButtonPromptEditor
        :prompt="prompt"
        :title="title"
        @close="toggleClickEdit"
        @save-prompt="handleSavePrompt"
      />
    </section>

    <section ref="tooltipHoverElement" :class="$style.tooltip" :hidden="!promptTooltipVisible">
      <SuperButtonTooltip :prompt="prompt" @edit="toggleClickEdit" />
    </section>

    <section v-if="stopTooltipVisible" :class="$style.tooltip">
      <SuperButtonTooltip text="Stop writing" />
    </section>

    <!-- <section v-if="undoTooltipVisible" :class="$style.tooltip">
      <SuperButtonTooltip text="Undo" />
    </section> -->

    <section :class="$style.buttonWrapper">
      <section
        v-if="undoTooltipVisible"
        :class="[$style.superButton, $style.undoButton]"
        @click="handleUndo"
      >
        <span :class="$style.superButtonIcon"></span>
      </section>
      <section ref="buttonHoverElement" :class="$style.superButton" @click="handleClick">
        <img :class="$style.superButtonIcon" :src="icon" />
      </section>
    </section>
  </section>
</template>

<script setup>
import {ref, computed, watch} from 'vue'
import {useMousePressed, useElementHover} from '@vueuse/core'

import webpilot from 'data-url:./icon/webpilot.svg'
import webpilotHover from 'data-url:./icon/webpilotHover.svg'
import webpilotActive from 'data-url:./icon/webpilotActive.svg'

import generating from 'data-url:./icon/generating.svg'
import generatingHover from 'data-url:./icon/generatingHover.svg'
import generatingActive from 'data-url:./icon/generatingActive.svg'

import {SUPER_BUTTON_STATUS} from '@/config'

import SuperButtonTooltip from './SuperButtonTooltip.vue'
import SuperButtonPromptEditor from './SuperButtonPromptEditor.vue'

// import undo from './icon/undo.svg'
// import undoHover from './icon/undoHover.svg'
// import undoActive from './icon/undoActive.svg'

const SUPER_BUTTON_ICON = {
  [SUPER_BUTTON_STATUS.pending]: {
    default: webpilot,
    hovered: webpilotHover,
    pressed: webpilotActive,
  },
  [SUPER_BUTTON_STATUS.generating]: {
    default: generating,
    hovered: generatingHover,
    pressed: generatingActive,
  },
  [SUPER_BUTTON_STATUS.done]: {
    default: webpilot,
    hovered: webpilotHover,
    pressed: webpilotActive,
  },
}

const emits = defineEmits(['fire', 'abort', 'undo'])

const props = defineProps({
  done: {type: Boolean, default: false},
  generating: {type: Boolean, default: false},
  prompt: {type: String, default: ''},
  title: {type: String, default: ''},
})

const tooltipHoverElement = ref()
const buttonHoverElement = ref()
const buttonDelayHovered = ref(false)
const promptEditorVisible = ref(false)
const forcePending = ref(false)
const forceDone = ref(false)
const buttonHovered = useElementHover(buttonHoverElement)
const tooltipHovered = useElementHover(tooltipHoverElement)

const {pressed} = useMousePressed()

const status = computed(() => {
  if (forceDone.value) return SUPER_BUTTON_STATUS.done
  if (forcePending.value) return SUPER_BUTTON_STATUS.pending
  if (props.done) return SUPER_BUTTON_STATUS.done
  if (props.generating) return SUPER_BUTTON_STATUS.generating
  return SUPER_BUTTON_STATUS.pending
})

const icon = computed(() => {
  if (buttonHovered.value && pressed.value) return SUPER_BUTTON_ICON[status.value].pressed
  if (buttonHovered.value) return SUPER_BUTTON_ICON[status.value].hovered
  return SUPER_BUTTON_ICON[status.value].default
})

const promptTooltipVisible = computed(() => {
  return (
    status.value !== SUPER_BUTTON_STATUS.generating &&
    !promptEditorVisible.value &&
    (tooltipHovered.value || buttonDelayHovered.value)
  )
})

const stopTooltipVisible = computed(() => {
  return status.value === SUPER_BUTTON_STATUS.generating && buttonHovered.value
})

const undoTooltipVisible = computed(() => {
  return status.value === SUPER_BUTTON_STATUS.done
})

let timer = null
watch(buttonHovered, buttonHovered => {
  if (!buttonHovered) {
    timer = setTimeout(() => {
      buttonDelayHovered.value = false
    }, 500)
  } else {
    clearTimeout(timer)
    buttonDelayHovered.value = true
  }
})

function handleClick() {
  if (status.value === SUPER_BUTTON_STATUS.generating) {
    emits('abort')
    forcePending.value = false
    forceDone.value = false
    return
  }
  if (status.value === SUPER_BUTTON_STATUS.pending || status.value === SUPER_BUTTON_STATUS.done) {
    emits('fire', {prompt: props.prompt})
    forcePending.value = false
    forceDone.value = false
  }

  // if (status.value === SUPER_BUTTON_STATUS.done) {
  //   emits('undo')
  //   forcePending.value = true
  //   forceDone.value = false
  // }
}

function handleUndo() {
  if (status.value === SUPER_BUTTON_STATUS.done) {
    emits('undo')
    forcePending.value = true
    forceDone.value = false
  }
}

function handleSavePrompt({prompt}) {
  emits('fire', {prompt})
}

function toggleClickEdit() {
  promptEditorVisible.value = !promptEditorVisible.value
  buttonDelayHovered.value = false
}
</script>

<style lang="scss" module>
.webpilotSuperButtonContainer {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.buttonWrapper {
  display: flex;
  gap: 4px;
}

.superButton {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background-color: #fff;
  border: 1px solid #eeefff;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgb(0 0 0 / 11%), 0 5px 15px rgb(0 0 0 / 7.95%);
  cursor: pointer;
}

.superButtonIcon {
  width: 16px;
  height: 16px;
  user-select: none;
  -webkit-user-drag: none;
  -moz-user-drag: none;
  -ms-user-drag: none;
}

.undoButton {
  .superButtonIcon {
    background-image: url('data-base64:~src/components/SuperButton/icon/undo.svg');
    background-repeat: no-repeat;
  }

  &:hover .superButtonIcon {
    background-image: url('data-base64:~src/components/SuperButton/icon/undoHover.svg');
  }

  &:active .superButtonIcon {
    background-image: url('data-base64:~src/components/SuperButton/icon/undoActive.svg');
  }
}

.tooltip {
  position: relative;
  margin-bottom: 6px;
}

.promptEditor {
  width: 480px;
  margin-bottom: 2px;
}
</style>

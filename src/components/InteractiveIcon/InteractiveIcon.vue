<template>
  <section
    v-if="type"
    ref="node"
    :class="[$style.ico, {[$style['ico--empty']]: !label}, $style[iconClassName]]"
    :style="{fontSize: `${size}px`}"
  >
    <article
      v-if="label"
      :class="[$style.txt, $style[`txt-${type}`], $style[`txt-${type}--${state}`]]"
    >
      {{ label }}
    </article>
  </section>
</template>

<script setup>
import {ref, computed, watch} from 'vue'
import {useMousePressed, useElementHover} from '@vueuse/core'

const ICON_STATE = {
  DEFAULT: 'default',
  HOVER: 'hover',
  CLICK: 'click',
  DISABLE: 'disable',
}

const node = ref(null)
const isHovered = ref(false)
const isClicked = ref(false)
const delayHover = useElementHover(node)
const {pressed: delayClick} = useMousePressed({target: node})

const props = defineProps({
  type: {type: String, default: ''},
  disable: {type: String, default: ''},
  hoverDelay: {type: Number, default: 0},
  clickDelay: {type: Number, default: 0},
  label: {type: String, default: ''},
  size: {type: Number, default: 24},
  // value 0 means do not handle hover state
  // value 1 implies control hover state as a normal state
  // value 2 implies control hover state as an active state
  hoverState: {type: Number, default: 0},
})

const state = computed(() => {
  if (props.disable) return ICON_STATE.DISABLE
  if (isClicked.value) return ICON_STATE.CLICK
  if (isHovered.value) return ICON_STATE.HOVER
  return ICON_STATE.DEFAULT
})
const iconClassName = computed(() => {
  if (!props.hoverState) return `img-${props.type}--${state.value}`
  if (props.hoverState === 2) return `img-${props.type}--hover`
  return `img-${props.type}--default`
})

let hoverTimer = null
watch(delayHover, currentState => {
  if (props.hoverState > 0) return
  if (props.hoverDelay === 0) isHovered.value = currentState
  else if (!currentState) hoverTimer = setTimeout(() => (isHovered.value = false), props.hoverDelay)
  else {
    clearTimeout(hoverTimer)
    isHovered.value = true
  }
})
let clickTimer = null
watch(delayClick, currentState => {
  if (props.hoverDelay === 0) isClicked.value = currentState
  else if (!currentState) clickTimer = setTimeout(() => (isClicked.value = false), props.hoverDelay)
  else {
    clearTimeout(clickTimer)
    isClicked.value = true
  }
})
</script>

<style lang="scss" module>
.ico {
  display: flex;
  background: left center / auto 100% no-repeat;
}

.ico:hover {
  cursor: pointer;
}

.ico--empty {
  padding: 1em 0 0 1em;
}

.txt {
  padding-left: 28px;
  font-weight: 600;
  font-size: 14px;
  line-height: 24px;
}

.txt:hover {
  text-decoration: underline;
}

// text effect config
.txt-save {
  color: #4f5aff;
}

.txt-save--click {
  color: #292f8e;
}

.txt-delete {
  color: #585b58;
}

.txt-delete--click {
  color: #292f8e;
}

@media (prefers-color-scheme: dark) {
  .txt-save,
  .txt-delete {
    color: #fff;
  }

  .txt-save--click,
  .txt-delete--click {
    color: #dcdee1;
  }
}

// icon effect config
.img-close--click {
  background-image: url('data-base64:~src/components/InteractiveIcon/image/CloseLightClick.svg');
}

.img-close--default {
  background-image: url('data-base64:~src/components/InteractiveIcon/image/CloseLightDefault.svg');
}

.img-close--disable {
  background-image: url('data-base64:~src/components/InteractiveIcon/image/CloseLightDisable.svg');
}

.img-close--hover {
  background-image: url('data-base64:~src/components/InteractiveIcon/image/CloseLightHover.svg');
}

.img-collect--click {
  background-image: url('data-base64:~src/components/InteractiveIcon/image/CollectLightClick.svg');
}

.img-collect--default {
  background-image: url('data-base64:~src/components/InteractiveIcon/image/CollectLightDefault.svg');
}

.img-collect--disable {
  background-image: url('data-base64:~src/components/InteractiveIcon/image/CollectLightDisable.svg');
}

.img-collect--hover {
  background-image: url('data-base64:~src/components/InteractiveIcon/image/CollectLightHover.svg');
}

.img-copy--click {
  background-image: url('data-base64:~src/components/InteractiveIcon/image/CopyLightClick.svg');
}

.img-copy--default {
  background-image: url('data-base64:~src/components/InteractiveIcon/image/CopyLightDefault.svg');
}

.img-copy--disable {
  background-image: url('data-base64:~src/components/InteractiveIcon/image/CopyLightDisable.svg');
}

.img-copy--hover {
  background-image: url('data-base64:~src/components/InteractiveIcon/image/CopyLightHover.svg');
}

.img-delete--click {
  background-image: url('data-base64:~src/components/InteractiveIcon/image/DeleteLightClick.svg');
}

// no disable state
.img-delete--default {
  background-image: url('data-base64:~src/components/InteractiveIcon/image/DeleteLightDefault.svg');
}

.img-delete--hover {
  background-image: url('data-base64:~src/components/InteractiveIcon/image/DeleteLightHover.svg');
}

.img-previous--click {
  background-image: url('data-base64:~src/components/InteractiveIcon/image/PreviousLightClick.svg');
}

.img-previous--default {
  background-image: url('data-base64:~src/components/InteractiveIcon/image/PreviousLightDefault.svg');
}

.img-previous--disable {
  background-image: url('data-base64:~src/components/InteractiveIcon/image/PreviousLightDisable.svg');
}

.img-previous--hover {
  background-image: url('data-base64:~src/components/InteractiveIcon/image/PreviousLightHover.svg');
}

.img-setting--click {
  background-image: url('data-base64:~src/components/InteractiveIcon/image/SettingLightClick.svg');
}

.img-setting--default {
  background-image: url('data-base64:~src/components/InteractiveIcon/image/SettingLightDefault.svg');
}

.img-setting--disable {
  background-image: url('data-base64:~src/components/InteractiveIcon/image/SettingLightDisable.svg');
}

.img-setting--hover {
  background-image: url('data-base64:~src/components/InteractiveIcon/image/SettingLightHover.svg');
}

.img-keep--click {
  background-image: url('data-base64:~src/components/InteractiveIcon/image/SaveLightClick.svg');
}

.img-keep--default {
  background-image: url('data-base64:~src/components/InteractiveIcon/image/SaveLightDisable.svg');
}

.img-keep--hover {
  background-image: url('data-base64:~src/components/InteractiveIcon/image/SaveLightHover.svg');
}

// no disable state
.img-save--click {
  background-image: url('data-base64:~src/components/InteractiveIcon/image/SaveLightClick.svg');
}

.img-save--default {
  background-image: url('data-base64:~src/components/InteractiveIcon/image/SaveLightDefault.svg');
}

.img-save--hover {
  background-image: url('data-base64:~src/components/InteractiveIcon/image/SaveLightHover.svg');
}

.img-pencil--click {
  background-image: url('data-base64:~src/components/InteractiveIcon/image/PencilLightClick.svg');
}

.img-pencil--default {
  background-image: url('data-base64:~src/components/InteractiveIcon/image/PencilLightDefault.svg');
}

.img-pencil--hover {
  background-image: url('data-base64:~src/components/InteractiveIcon/image/PencilLightHover.svg');
}

.img-send--default {
  background-image: url('data-base64:~src/components/InteractiveIcon/image/SendLightDefault.svg');
}

.img-send--hover {
  background-image: url('data-base64:~src/components/InteractiveIcon/image/SendLightHover.svg');
}

.img-send--click {
  background-image: url('data-base64:~src/components/InteractiveIcon/image/SendLightClick.svg');
}

@media (prefers-color-scheme: dark) {
  .img-close--click {
    background-image: url('data-base64:~src/components/InteractiveIcon/image/CloseDarkClick.svg');
  }

  .img-close--default {
    background-image: url('data-base64:~src/components/InteractiveIcon/image/CloseDarkDefault.svg');
  }

  .img-close--disable {
    background-image: url('data-base64:~src/components/InteractiveIcon/image/CloseDarkDisable.svg');
  }

  .img-close--hover {
    background-image: url('data-base64:~src/components/InteractiveIcon/image/CloseDarkHover.svg');
  }

  .img-collect--click {
    background-image: url('data-base64:~src/components/InteractiveIcon/image/CollectDarkClick.svg');
  }

  .img-collect--default {
    background-image: url('data-base64:~src/components/InteractiveIcon/image/CollectDarkDefault.svg');
  }

  .img-collect--disable {
    background-image: url('data-base64:~src/components/InteractiveIcon/image/CollectDarkDisable.svg');
  }

  .img-collect--hover {
    background-image: url('data-base64:~src/components/InteractiveIcon/image/CollectDarkHover.svg');
  }

  .img-copy--click {
    background-image: url('data-base64:~src/components/InteractiveIcon/image/CopyDarkClick.svg');
  }

  .img-copy--default {
    background-image: url('data-base64:~src/components/InteractiveIcon/image/CopyDarkDefault.svg');
  }

  .img-copy--disable {
    background-image: url('data-base64:~src/components/InteractiveIcon/image/CopyDarkDisable.svg');
  }

  .img-copy--hover {
    background-image: url('data-base64:~src/components/InteractiveIcon/image/CopyDarkHover.svg');
  }

  .img-delete--click {
    background-image: url('data-base64:~src/components/InteractiveIcon/image/DeleteDarkClick.svg');
  }

  .img-delete--default {
    background-image: url('data-base64:~src/components/InteractiveIcon/image/DeleteDarkDefault.svg');
  }

  .img-delete--hover {
    background-image: url('data-base64:~src/components/InteractiveIcon/image/DeleteDarkHover.svg');
  }

  .img-previous--click {
    background-image: url('data-base64:~src/components/InteractiveIcon/image/PreviousDarkClick.svg');
  }

  .img-previous--default {
    background-image: url('data-base64:~src/components/InteractiveIcon/image/PreviousDarkDefault.svg');
  }

  .img-previous--disable {
    background-image: url('data-base64:~src/components/InteractiveIcon/image/PreviousDarkDisable.svg');
  }

  .img-previous--hover {
    background-image: url('data-base64:~src/components/InteractiveIcon/image/PreviousDarkHover.svg');
  }

  .img-setting--click {
    background-image: url('data-base64:~src/components/InteractiveIcon/image/SettingDarkClick.svg');
  }

  .img-setting--default {
    background-image: url('data-base64:~src/components/InteractiveIcon/image/SettingDarkDefault.svg');
  }

  .img-setting--disable {
    background-image: url('data-base64:~src/components/InteractiveIcon/image/SettingDarkDisable.svg');
  }

  .img-setting--hover {
    background-image: url('data-base64:~src/components/InteractiveIcon/image/SettingDarkHover.svg');
  }

  .img-keep--click {
    background-image: url('data-base64:~src/components/InteractiveIcon/image/SaveDarkClick.svg');
  }

  .img-keep--default {
    background-image: url('data-base64:~src/components/InteractiveIcon/image/SaveDarkDisable.svg');
  }

  .img-keep--hover {
    background-image: url('data-base64:~src/components/InteractiveIcon/image/SaveDarkHover.svg');
  }

  // no disable state
  .img-save--click {
    background-image: url('data-base64:~src/components/InteractiveIcon/image/SaveDarkClick.svg');
  }

  .img-save--default {
    background-image: url('data-base64:~src/components/InteractiveIcon/image/SaveDarkDefault.svg');
  }

  .img-save--hover {
    background-image: url('data-base64:~src/components/InteractiveIcon/image/SaveDarkHover.svg');
  }

  .img-pencil--click {
    background-image: url('data-base64:~src/components/InteractiveIcon/image/PencilDarkClick.svg');
  }

  .img-pencil--default {
    background-image: url('data-base64:~src/components/InteractiveIcon/image/PencilDarkDefault.svg');
  }

  .img-pencil--hover {
    background-image: url('data-base64:~src/components/InteractiveIcon/image/PencilDarkHover.svg');
  }

  .img-send--default {
    background-image: url('data-base64:~src/components/InteractiveIcon/image/SendDarkDefault.svg');
  }

  .img-send--hover {
    background-image: url('data-base64:~src/components/InteractiveIcon/image/SendDarkHover.svg');
  }

  .img-send--click {
    background-image: url('data-base64:~src/components/InteractiveIcon/image/SendDarkClick.svg');
  }
}
</style>

<template>
  <section
    v-if="type"
    ref="node"
    :class="[$style.ico, {[$style['ico--empty']]: !label}, $style[`img-${type}--${status}`]]"
  >
    <article
      v-if="label"
      :class="[$style.txt, $style[`txt-${type}`], $style[`txt-${type}--${status}`]]"
    >
      {{ label }}
    </article>
  </section>
</template>

<script setup>
import {ref, computed, watch} from 'vue'
import {useMousePressed, useElementHover} from '@vueuse/core'

const ICON_STATUS = {
  DEFAULT: 'default',
  HOVER: 'hover',
  CLICK: 'click',
  DISABLE: 'disable',
}

const node = ref(null)
const isHovered = ref(false)
const delayHover = useElementHover(node)
const {pressed: isClicked} = useMousePressed({target: node})

const props = defineProps({
  type: {type: String, default: ''},
  disable: {type: String, default: ''},
  hoverDelay: {type: Number, default: 0},
  label: {type: String, default: ''},
})

const status = computed(() => {
  if (props.disable) return ICON_STATUS.DISABLE
  if (isClicked.value) return ICON_STATUS.CLICK
  if (isHovered.value) return ICON_STATUS.HOVER
  return ICON_STATUS.DEFAULT
})

let timer = null
watch(delayHover, hoverState => {
  if (props.hoverDelay === 0) isHovered.value = hoverState
  else if (!hoverState) timer = setTimeout(() => (isHovered.value = false), props.hoverDelay)
  else {
    clearTimeout(timer)
    isHovered.value = true
  }
})
</script>

<style lang="scss" module>
.ico {
  display: flex;
  font-size: 24px;
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

// no disable status
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

// no disable status
.img-save--click {
  background-image: url('data-base64:~src/components/InteractiveIcon/image/SaveLightClick.svg');
}

.img-save--default {
  background-image: url('data-base64:~src/components/InteractiveIcon/image/SaveLightDefault.svg');
}

.img-save--hover {
  background-image: url('data-base64:~src/components/InteractiveIcon/image/SaveLightHover.svg');
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

// no disable status
.img-pencil--click {
  background-image: url('data-base64:~src/components/InteractiveIcon/image/PencilLightClick.svg');
}

.img-pencil--default {
  background-image: url('data-base64:~src/components/InteractiveIcon/image/PencilLightDefault.svg');
}

.img-pencil--hover {
  background-image: url('data-base64:~src/components/InteractiveIcon/image/PencilLightHover.svg');
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

  .img-save--click {
    background-image: url('data-base64:~src/components/InteractiveIcon/image/SaveDarkClick.svg');
  }

  .img-save--default {
    background-image: url('data-base64:~src/components/InteractiveIcon/image/SaveDarkDefault.svg');
  }

  .img-save--hover {
    background-image: url('data-base64:~src/components/InteractiveIcon/image/SaveDarkHover.svg');
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

  .img-pencil--click {
    background-image: url('data-base64:~src/components/InteractiveIcon/image/PencilDarkClick.svg');
  }

  .img-pencil--default {
    background-image: url('data-base64:~src/components/InteractiveIcon/image/PencilDarkDefault.svg');
  }

  .img-pencil--hover {
    background-image: url('data-base64:~src/components/InteractiveIcon/image/PencilDarkHover.svg');
  }
}
</style>

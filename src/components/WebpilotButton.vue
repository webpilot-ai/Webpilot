<template>
  <button
    :class="{
      [$style.button]: true,
      [$style.primary]: type === ButtonType.PRIMARY,
      [$style.ghost]: type === ButtonType.GHOST,
      [$style.disabled]: disabled || loading,
    }"
    :disabled="disabled"
    @click="handleClick"
  >
    <IconLoading v-if="loading" :class="$style.loading" />
    <template v-else>{{ value }}</template>
  </button>
</template>

<script setup>
import IconLoading from './icon/IconLoading.vue'

const ButtonType = {
  PRIMARY: 'primary',
  GHOST: 'ghost',
}

const emits = defineEmits(['click'])

const props = defineProps({
  type: {
    type: String,
    default: 'primary',
  },
  loading: {
    type: Boolean,
    default: false,
  },
  value: {
    type: String,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

const handleClick = () => {
  if (props.disabled) return
  emits('click')
}
</script>

<style lang="scss" module>
.button {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 36px;
  padding: 8px 16px;
  font-weight: 500;
  font-size: 14px !important;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    box-shadow: 0 5px 15px 0 rgb(0 0 0 / 8%), 0 2px 4px 0 rgb(0 0 0 / 11%);
  }
}

.primary {
  color: #fff;
  background-color: #4f5aff;

  &:active {
    background: #292f8e;
  }
}

.ghost {
  color: #292929;
  background-color: rgb(255 255 255 / 0%);
}

.disabled {
  color: #fff;
  background-color: #929497;
  cursor: not-allowed;

  &:hover {
    box-shadow: none;
  }

  &:active {
    background-color: #929497;
  }
}

.loading {
  cursor: not-allowed;
  animation: rotation 1s infinite linear;
}

@keyframes rotation {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(359deg);
  }
}
</style>

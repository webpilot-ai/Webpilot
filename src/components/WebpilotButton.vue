<template>
  <button
    :class="{
      [$style.button]: true,
      [$style.primary]: type === ButtonType.PRIMARY,
      [$style.ghost]: type === ButtonType.GHOST,
      [$style.disabled]: disalbed || loading,
    }"
    :disabled="disalbed"
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
  disalbed: {
    type: Boolean,
    default: false,
  },
})

const handleClick = () => {
  if (props.disalbed) return
  emits('click')
}
</script>

<style lang="scss" module>
.button {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 32px;
  padding: 8px 16px;
  font-weight: 500;
  font-size: 14px !important;
  line-height: 20px !important;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.primary {
  color: #fff;
  background-color: #4f5aff;
}

.ghost {
  color: #292929;
  background-color: rgb(255 255 255 / 0%);
}

.disabled {
  color: #fff;
  background-color: #929497;
  cursor: not-allowed;
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

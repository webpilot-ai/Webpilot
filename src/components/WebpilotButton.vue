<template>
  <button
    :class="{
      [$style.button]: true,
      [$style.primary]: type === ButtonType.PRIMARY,
      [$style.ghost]: type === ButtonType.GHOST,
      [$style.disabled]: disalbed,
    }"
    :disabled="disalbed"
    @click="handleClick"
  >
    {{ value }}
  </button>
</template>

<script setup>
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
  cursor: not-allowed;
  filter: brightness(0.5);
}
</style>

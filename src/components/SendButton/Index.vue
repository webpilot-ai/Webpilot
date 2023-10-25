<template>
  <IconLoading v-if="loading" :class="$style.loading" />
  <div
    v-else
    :class="[
      $style.airplane,
      {[$style['airplane--activate']]: activate},
      {[$style['airplane--disabled']]: disabled},
    ]"
  />
</template>

<script setup>
import IconLoading from '../icon/IconLoading.vue'

defineProps({
  activate: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
})
</script>

<style lang="scss" module>
.airplane {
  width: 24px;
  height: 24px;
  background: center / 100% no-repeat;

  // background-image: url('data-base64:~src/components/SendButton/image/SendOutlineLight.svg');
  cursor: pointer;

  // &--activate {
  //   background-image: url('data-base64:~src/components/SendButton/image/SendFilledLight.svg');
  // }

  &--disabled {
    cursor: not-allowed;
  }
}

@media (prefers-color-scheme: dark) {
  .airplane {
    // background-image: url('data-base64:~src/components/SendButton/image/SendOutlineDark.svg');

    // &--activate {
    //   background-image: url('data-base64:~src/components/SendButton/image/SendFilledDark.svg');
    // }
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

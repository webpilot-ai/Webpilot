<template>
  <section :class="$style.container">
    <WelcomeTitle @on-prev="goBack">{{ $gettext('Pin Webpilot') }}</WelcomeTitle>
    <span :class="$style.content"
      >{{ $gettext('Click') }} <IconJigsaw />{{
        $gettext('and pin Webpilot to your nav bar')
      }}</span
    >
    <ImagePinGuide :class="$style.picture" />
  </section>
</template>

<script setup>
import {$gettext} from '@/utils/i18n'
import IconJigsaw from '@/components/icon/IconJigsaw.vue'
import ImagePinGuide from '@/components/image/ImagePinGuide.vue'

import WelcomeTitle from './WelcomeTitle.vue'

const emits = defineEmits(['onPrev'])

const goBack = () => emits('onPrev')
</script>

<style module lang="scss">
.container {
  text-align: center;
}

.content {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 32px 0 18px;
  color: #292929;
  font-weight: 400;
  font-size: 18px;

  svg {
    width: 16px;
    height: 16px;
    margin: 0 4px;
  }
}

.picture {
  display: inline-block;
}
</style>

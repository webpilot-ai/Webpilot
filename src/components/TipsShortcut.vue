<template>
  <section :class="$style.shortcutWrap">
    <span :class="$style.shortcutText">Shortcut:</span>
    <section :class="$style.shortcutKeys">
      {{ isMacOS ? '⌘+M' : 'Ctrl+M' }}
    </section>
  </section>
</template>

<script setup>
import {getOS} from '@/utils/index'

const isMacOS = getOS() === 'Mac OS'
</script>

<style lang="scss" module>
.shortcutWrap {
  display: flex;
  flex-direction: row;
}

.shortcutText {
  color: #929497;
  font-weight: 500;
  font-size: 12px;
  line-height: 17px;
}

.shortcutKeys {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 20px;
  margin-left: 4px !important;
  padding: 0 2px;
  color: #929497;
  font-weight: 400;
  font-size: 14px !important;
  line-height: 20px;
  background: #fff;
  border: 1px solid #929497;
  border-radius: 5px;
}
</style>

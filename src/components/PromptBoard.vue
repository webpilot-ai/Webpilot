<template>
  <section :class="$style.container">
    <article :class="$style.container__frame">
      <div :class="$style.board">
        <div :class="$style.board__delete" @click="removeImage"><IconWhiteClose /></div>
        <img :src="picture" />
      </div>
    </article>
    <footer :class="$style.control">
      <span :class="$style.control__keys"><IconEnter :class="$style.control__icon" />Enter</span>
      <p :class="$style.control__tips">{{ $gettext('Search') }}</p>
    </footer>
  </section>
</template>

<script setup>
import IconEnter from '@/components/icon/IconEnter.vue'
import IconWhiteClose from '@/components/icon/IconWhiteClose.vue'

const emits = defineEmits(['onDelete'])
defineProps({
  picture: {type: String, default: ''},
})

const removeImage = () => {
  emits('onDelete')
}
</script>

<style lang="scss" module>
.container {
  position: absolute;
  top: 44px;
  left: 0;
  width: 100%;
  background-color: var(--webpilot-theme-main-background-color, #fff);
  border-bottom-right-radius: 10px;
  border-bottom-left-radius: 10px;
  box-shadow: 0 2px 6px var(--webpilot-theme-main-background-shadow, rgb(0 0 0 / 20%));

  .container__frame {
    display: flex;
    justify-content: center;
    margin: 0 8px;
    padding: 15px;
    border: 1px solid var(--webpilot-theme-stoke-and-hover-status, #dcdee1);
    border-top: 0;
  }
}

.board {
  position: relative;
}

.board__delete {
  position: absolute;
  top: -9px;
  right: -9px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  background-color: #929497;
  border-radius: 18px;
  cursor: pointer;
}

.control {
  display: flex;
  justify-content: flex-end;
  padding: 8px 0;
}

.control__keys {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 0 0 12px;
  padding: 0 4px;
  line-height: 20px;
  border: 1px solid var(--webpilot-theme-stoke-and-hover-status, #dcdee1);
  border-radius: 4px;
}

.control__tips {
  margin: 0 8px;
  line-height: 22px;
}

.control__keys,
.control__tips {
  color: var(--webpilot-theme-main-text-color, #292929);
  font-weight: 600;
  font-size: 10px;
}

.control__ticon {
  padding: 2px 2px 0 0;
}
</style>

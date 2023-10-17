<template>
  <section :class="{[$style.promptListItem]: true, [$style.promptListItemActive]: active}">
    {{ title }}
    <IconPencil v-if="active" :class="$style.icon" @click.stop="onEdit" />
  </section>
</template>

<script setup>
// import IconPencil from './icon/IconPencil.vue'

// eslint-disable-next-line
const props = defineProps({
  title: {type: String, default: ''},
  active: {type: Boolean, default: false},
})

const emits = defineEmits(['onEdit'])

const onEdit = () => {
  emits('onEdit')
}
</script>

<style lang="scss" module>
.promptListItem {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 25px;
  padding: 4px 8px;
  color: #4f5aff;
  font-weight: 500;
  font-size: 12px;
  line-height: 17px;
  border: 1px solid #4f5aff;
  border-radius: 4px;
  cursor: pointer;
}

.icon {
  margin-left: 10px !important;
}

.promptListItemActive {
  color: #fff;
  background-color: #4f5aff;
}
</style>

<template>
  <section v-if="info" :class="contributor.main">
    <img alt="avatar" :src="info.avatar" />
    <a
      v-if="info.page"
      :class="contributor.name"
      :href="info.page"
      rel="noreferrer"
      target="_blank"
      >{{ info.name }}</a
    >
    <span v-else :class="contributor.name">{{ info.name }}</span>
    <span :class="contributor.title">{{ info.bio }}</span>
  </section>
</template>

<script setup>
defineProps({
  info: {
    type: Object,
    required: true,
  },
})
</script>

<style module="contributor" lang="scss">
.main {
  display: flex;
  flex-direction: column;
  width: 155px;
  height: 143px;
  margin-right: 16px;
  margin-bottom: 16px;
  padding: 16px;
  background-color: #fff;
  border-radius: 20px;
  box-shadow: 0 8px 24px rgb(149 157 165 / 20%);

  img {
    width: 48px;
    height: 48px;
    margin: 0 0 7px;
    border-radius: 50%;
  }

  .name {
    margin: 0 0 2px;
    color: #4f5aff;
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
  }

  .title {
    color: #585b58;
    white-space: pre-wrap;
  }
}
</style>

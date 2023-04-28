<template>
  <div :class="[about.main]">
    <span :class="about.title"> About </span>
  </div>
</template>

<script setup></script>

<style module="about" lang="scss">
.main {
  margin-top: 20px;
  padding: 24px 16px;
  background-color: white;
  border-radius: 10px;

  .title {
    color: #4f5aff;
    font-weight: 400;
    font-size: 24px;
    line-height: 34px;
  }
}
</style>

<template>
  <section :class="$style.tipsWrap">
    <section v-if="type === 'INIT_KEY'" :class="$style.initKey">
      <section>To get started, please enter <b>API Key</b> from OpenAI Website</section>
      <section>
        <a href=" https://platform.openai.com/account/api-keys" target="_blank"
          >https://platform.openai.com/account/api-keys</a
        >
      </section>
    </section>

    <section v-if="type === 'SELECT_TEXT'" :class="$style.selectText">
      With the selected content “<span>{{ selectedText }}</span
      >”
    </section>

    <section v-if="type === 'ASK_PAGE'" :class="$style.askPage">
      <input type="checkbox" />

      Answer based on this page “<span>{{ selectedText }}</span
      >”
    </section>
  </section>
</template>

<script setup>
// eslint-disable-next-line
const props = defineProps({
  type: {
    type: String,
    required: true,
  },
})

const selectedText = 'GlobalEventHandlers hello fdjklsa jklfdsa jkfldsa jklfds '
</script>

<style lang="scss" module>
.tipsWrap {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #000;
  font-weight: 400;
  font-size: 14px;
  font-style: normal;
  line-height: 20px;
  white-space: nowrap;
}

.initKey {
  width: 382px;
  text-align: left;
  overflow-wrap: break-word;

  a,
  a:visited {
    color: #4f5aff;
    text-decoration: underline;
  }
}

.selectText {
  display: flex;
  width: 400px;
  text-align: left;

  span {
    display: inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.askPage {
  display: flex;
  width: 400px;
  text-align: left;

  span {
    display: inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>

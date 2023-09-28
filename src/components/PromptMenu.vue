<template>
  <section>
    <ol :class="$style.list">
      <li
        v-for="(item, index) in prompts"
        :key="index"
        :class="[$style.item, {[$style['item--activate']]: tabIndex === index}]"
        @click="() => handleSelectPrompt(index)"
        @mouseover="() => handleHoverPrompt(index)"
      >
        <h1 :class="$style.name">{{ item.title }}</h1>
        <p :class="$style.describe">{{ item.command }}</p>
        <!-- @on-edit="() => handleEditPrompt(index)" -->
        <!-- <li :active="false" :class="$style.propmtItem" title="+" @click="handleAddPrompt" /> -->
      </li>
    </ol>
    <article :class="$style.footer">
      <span :class="$style['footer__keys']">Tab</span>
      <p :class="$style['footer__tips']">Choose prompts</p>
      <span :class="$style['footer__keys']"
        ><IconSmallBack :class="$style['footer__icon']" />Enter</span
      >
      <p :class="$style['footer__tips']">Search</p>
    </article>
  </section>
</template>

<script setup>
import {toRaw} from 'vue'

import IconSmallBack from '@/components/icon/IconSmallBack.vue'

const emits = defineEmits(['onChange', 'onEditPrompt', 'onAddPrompt', 'onMouseOver'])
const props = defineProps({
  prompts: {
    type: Array,
    required: true,
    default: () => [],
  },
  selectedIndex: {
    type: Number,
    default: -1,
  },
  tabIndex: {
    type: Number,
    default: -1,
  },
})

const handleSelectPrompt = index => {
  emits('onChange', {
    index,
    prompt: toRaw(props.prompts[index]),
  })
}

const handleHoverPrompt = index => {
  emits('onMouseOver', {index})
}

// const handleEditPrompt = index => {
//   emits('onEditPrompt', {
//     index,
//     prompt: toRaw(props.prompts[index]),
//   })
// }

// const handleAddPrompt = () => {
//   emits('onAddPrompt')
// }
</script>

<style lang="scss" module>
.list {
  margin: 0;
  padding: 0 8px;
  background-color: var(--webpilot-theme-main-background-color, #fff);
  border-radius: 10px;
}

.item {
  display: flex;
  padding: 8px 0;
  border-right: 1px solid #dcdee1;
  border-left: 1px solid #dcdee1;
  cursor: pointer;

  &:first-of-type {
    border-top: 1px solid #dcdee1;
  }

  &:last-of-type {
    border-bottom: 1px solid #dcdee1;
    border-bottom-right-radius: 10px;
    border-bottom-left-radius: 10px;
  }
}

.name {
  flex: none;
  width: 74px;
  margin: 0 6px;
  padding: 0 6px;
  color: #929497;
  font-weight: 600;
  font-size: 12px;
  line-height: 20px;
  border: 1px solid #dcdee1;
  border-radius: 10px;
}

.describe {
  color: #929497;
  font-size: 14px;
  text-align: left;
}

.name,
.describe {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.item--activate {
  background-color: #4f5aff33;

  .name {
    color: #4f5aff;
    border-color: #4f5aff;
  }

  .describe {
    font-weight: 600;
  }
}

.footer {
  display: flex;
  justify-content: flex-end;
  padding: 8px 0;

  &__keys {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 12px;
    padding: 0 4px;
    border: 1px solid #929497;
    border-radius: 4px;
  }

  &__tips {
    margin: 0 8px;
  }

  &__keys,
  &__tips {
    color: #929497;
    font-weight: 600;
    font-size: 10px;
    line-height: 20px;
  }

  &__icon {
    padding: 2px 2px 0 0;
  }
}
</style>

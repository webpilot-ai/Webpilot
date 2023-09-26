<template>
  <ol :class="$style.list">
    <li
      v-for="(item, index) in prompts"
      :key="index"
      :class="[$style.item, {[$style['item--activate']]: selectedIndex === index}]"
      @click="() => handleSelectPrompt(index)"
      @on-edit="() => handleEditPrompt(index)"
    >
      <h1 :class="$style.name">{{ item.title }}</h1>
      <p :class="$style.describe">{{ item.command }}</p>
    </li>
    <!-- <li :active="false" :class="$style.propmtItem" title="+" @click="handleAddPrompt" /> -->
  </ol>
</template>

<script setup>
import {toRaw} from 'vue'
// import PromptListItem from './PromptListItem.vue'

const emits = defineEmits(['onChange', 'onEditPrompt', 'onAddPrompt'])
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
})

const handleSelectPrompt = index => {
  emits('onChange', {
    index,
    prompt: toRaw(props.prompts[index]),
  })
}

const handleEditPrompt = index => {
  emits('onEditPrompt', {
    index,
    prompt: toRaw(props.prompts[index]),
  })
}

// const handleAddPrompt = () => {
//   emits('onAddPrompt')
// }
</script>

<style lang="scss" module>
.list {
  display: flex;
  flex-direction: row;
  height: 24px;
  margin-top: 4px !important;
  margin-bottom: 8px !important;
  color: black;
  font-size: 12px;
  line-height: 17px;
}

.item {
  display: flex;
}

// .item--activate {
// }
.name {
  border: 1px;
}

// .describe {
//   margin-left: 8px !important;
// }
</style>

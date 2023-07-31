<template>
  <section :class="$style.promptList">
    <PromptListItem
      v-for="(item, index) in prompts"
      :key="index"
      :active="selectedIndex === index"
      :class="$style.propmtItem"
      :title="item.title"
      @click="() => handleSelectPropmt(index)"
      @on-edit="() => handleEditPrompt(index)"
    />

    <PromptListItem :active="false" :class="$style.propmtItem" title="+" @click="handleAddPrompt" />
  </section>
</template>

<script setup>
import {toRaw} from 'vue'

import PromptListItem from './PromptListItem.vue'

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

const handleSelectPropmt = index => {
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

const handleAddPrompt = () => {
  emits('onAddPrompt')
}
</script>

<style lang="scss" module>
.promptList {
  display: flex;
  flex-direction: row;
  height: 24px;
  margin-top: 4px !important;
  margin-bottom: 8px !important;
  color: black;
  font-size: 12px;
  line-height: 17px;
}

.propmtItem + .propmtItem {
  margin-left: 8px !important;
}
</style>

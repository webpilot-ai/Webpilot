<template>
  <section :class="$style.container">
    <ol :class="$style.list">
      <li
        v-for="(item, index) in prompts"
        :key="index"
        :class="[$style.item, {[$style['item--activate']]: tabIndex === index}]"
        @mouseover="() => handleHoverPrompt(index)"
      >
        <h1 :class="$style.name" @click="() => handleSelectPrompt(index)">{{ item.title }}</h1>
        <p :class="$style.describe" @click="() => handleSelectPrompt(index)">{{ item.command }}</p>
        <div
          v-show="tabIndex === index"
          :class="$style.pen"
          @click="() => handleEditPrompt(index)"
          @mouseout="event => handleMouseOut(event, index)"
          @mouseover="event => handleMouseOver(event, index)"
        >
          <IconPencilEdit v-if="editStateArr[index] === 'press'" />
          <IconPencilHover v-else-if="editStateArr[index] === 'hover'" />
          <IconPencil v-else />
        </div>
      </li>
    </ol>
    <article :class="$style.footer">
      <span :class="$style.keys">Tab</span>
      <p :class="$style.tips">{{ $gettext('Choose prompts') }}</p>
      <span :class="$style.keys"><IconSmallBack :class="$style.icon" />Enter</span>
      <p :class="$style.tips">{{ $gettext('Search') }}</p>
    </article>
  </section>
</template>

<script setup>
import {toRaw, ref} from 'vue'

import IconSmallBack from '@/components/icon/IconEnter.vue'
import IconPencil from '@/components/icon/IconPencil.vue'
import IconPencilEdit from '@/components/icon/IconPencilEdit.vue'
import IconPencilHover from '@/components/icon/IconPencilHover.vue'
import {$gettext} from '@/utils/i18n'

const editStateArr = ref(['normal', 'normal', 'normal'])
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

const handleEditPrompt = index => {
  editStateArr.value[index] = 'press'
  emits('onEditPrompt', {
    index,
    prompt: toRaw(props.prompts[index]),
  })
}
const handleMouseOut = (event, index) => {
  if (event.target !== event.currentTarget) editStateArr.value[index] = 'normal'
}
const handleMouseOver = (event, index) => {
  if (event.target === event.currentTarget) return
  if (editStateArr.value[index] === 'press') return
  editStateArr.value[index] = 'hover'
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
}

.list {
  margin: 0;
  padding: 0 8px;
}

.item {
  display: flex;
  padding: 8px 0;
  background-color: var(--webpilot-theme-content-background-color, #fff);
  border-right: 1px solid var(--webpilot-theme-stoke-and-hover-status, #dcdee1);
  border-left: 1px solid var(--webpilot-theme-stoke-and-hover-status, #dcdee1);
  cursor: pointer;

  &:first-of-type {
    border-top: 1px solid var(--webpilot-theme-stoke-and-hover-status, #dcdee1);
  }

  &:last-of-type {
    border-bottom: 1px solid var(--webpilot-theme-stoke-and-hover-status, #dcdee1);
    border-bottom-right-radius: 10px;
    border-bottom-left-radius: 10px;
  }

  .name {
    flex: none;
    width: 74px;
    margin: 0 6px;
    padding: 0 6px;
    color: var(--webpilot-theme-main-text-color, #292929);
    font-weight: 600;
    font-size: 12px;
    line-height: 20px;
    border: 1px solid var(--webpilot-theme-stoke-and-hover-status, #dcdee1);
    border-radius: 10px;
  }

  .describe {
    flex: 1;
    margin: 0;
    color: var(--webpilot-theme-main-text-color, #292929);
    font-size: 14px;
    line-height: 22px;
    text-align: left;
  }

  .name,
  .describe {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}

.item--activate {
  background-color: var(--webpilot-theme-stoke-and-hover-status, #fff);

  .name {
    color: var(--webpilot-theme-brand-primary, #4f5aff);
    background-color: var(--webpilot-theme-main-background-color, #fff);

    // color: #4f5aff;
    // border-color: #4f5aff;
  }

  .describe {
    font-weight: 600;
  }
}

.pen {
  display: flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: 46px;
  height: 22px;
  padding: 0 12px;
  overflow: hidden;
  font-size: 0;
  cursor: pointer;
}

.footer {
  display: flex;
  justify-content: flex-end;
  padding: 8px 0;

  .keys {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 0 0 12px;
    padding: 0 4px;
    border: 1px solid var(--webpilot-theme-stoke-and-hover-status, #dcdee1);
    border-radius: 4px;
  }

  .tips {
    margin: 0 8px;
  }

  .keys,
  .tips {
    color: var(--webpilot-theme-main-text-color, #292929);
    font-weight: 600;
    font-size: 10px;
    line-height: 20px;
  }

  .icon {
    padding: 2px 2px 0 0;
  }
}
</style>

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
        <div v-show="tabIndex === index" :class="$style.pen" @click="() => handleEditPrompt(index)">
          <InteractiveIcon type="pencil" />
        </div>
      </li>
      <li
        :key="prompts.length"
        :class="[$style.item, {[$style['item--activate']]: tabIndex === prompts.length}]"
        @mouseover="() => handleHoverPrompt(prompts.length)"
      >
        <h2 :class="$style.increase" @click="handleCreatePrompt">
          + {{ $gettext('Add a new prompt') }}
        </h2>
      </li>
    </ol>
    <article :class="$style.footer">
      <span :class="$style.keys">Esc</span>
      <p :class="[$style.tips, $style.fill]">
        {{ showBack ? $gettext('Back') : $gettext('Close') }}
      </p>
      <span :class="$style.keys">⬆︎/⬇︎</span>
      <p :class="$style.tips">{{ $gettext('Choose') }}</p>
      <span :class="$style.keys"><IconEnter :class="$style.icon" />Enter</span>
      <p :class="$style.tips">{{ $gettext('Confirm') }}</p>
    </article>
  </section>
</template>

<script setup>
import {toRaw} from 'vue'

import IconEnter from '@/components/icon/IconEnter.vue'

import {$gettext} from '@/utils/i18n'

import InteractiveIcon from './InteractiveIcon/InteractiveIcon.vue'

const emits = defineEmits([
  'onChange',
  'onEditPrompt',
  'onAddPrompt',
  'onMouseOver',
  'onCreatePrompt',
])
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
  showBack: {
    type: Boolean,
    default: false,
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

const handleCreatePrompt = () => {
  emits('onCreatePrompt')
}

const handleEditPrompt = index => {
  emits('onEditPrompt', {
    index,
    prompt: toRaw(props.prompts[index]),
  })
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
}

.list {
  margin: 0;
  padding: 0 8px;
}

.item {
  display: flex;
  align-items: center;
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
    width: 80px;
    height: 20px;
    margin: 0 6px;
    padding: 0 6px;
    color: var(--webpilot-theme-main-text-color, #292929) !important;
    font-weight: 600;
    font-size: 12px !important;
    line-height: 20px;
    border: 1px solid var(--webpilot-theme-stoke-and-hover-status, #dcdee1);
    border-radius: 10px;
  }

  .describe {
    flex: 1;
    margin: 0;
    padding: 8px 0;
    color: var(--webpilot-theme-main-text-color, #292929) !important;
    font-weight: 400;
    font-size: 14px !important;
    line-height: 22px;
    text-align: left;
  }

  .name,
  .describe {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .increase {
    width: 100%;
    margin: 0;
    padding: 8px 0;
    color: var(--webpilot-theme-main-text-color, #292929);
    font-size: 14px;
    line-height: 22px;
  }
}

.item--activate {
  background-color: var(--webpilot-theme-stoke-and-hover-status, #fff);

  .name {
    color: var(--webpilot-theme-brand-primary, #4f5aff);
    background-color: var(--webpilot-theme-main-background-color, #fff);
  }
}

.pen {
  display: flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 24px;
  overflow: hidden;
  font-size: 0;
  cursor: pointer;
}

.footer {
  display: flex;
  padding: 8px 0;

  .keys {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 0 0 12px;
    padding: 0 4px;
    line-height: 20px;
    border: 1px solid var(--webpilot-theme-stoke-and-hover-status, #dcdee1);
    border-radius: 4px;
  }

  .tips {
    margin: 0 8px;
    line-height: 22px;
  }

  .fill {
    margin-right: auto;
  }

  .keys,
  .tips {
    color: var(--webpilot-theme-main-text-color, #292929);
    font-weight: 600;
    font-size: 10px;
  }

  .icon {
    padding: 2px 2px 0 0;
  }
}
</style>

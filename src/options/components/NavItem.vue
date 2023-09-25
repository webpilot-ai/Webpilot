<template>
  <div :class="[$style['nav-item'], activated ? $style['active-nav'] : null]" @click="onChange">
    <span :class="$style['icon-outline']">
      <slot name="outline">
        <IconPersonOutline />
      </slot>
    </span>
    <span :class="$style['icon-filled']">
      <slot name="filled">
        <iconPersonFilled />
      </slot>
    </span>
    <span :class="$style['nav-label']">{{ name }}</span>
  </div>
</template>

<script setup lang="ts">
import IconPersonOutline from '../images/icon-person-outline.vue'
import iconPersonFilled from '../images/icon-person-filled.vue'

const emits = defineEmits(['change'])

const props = defineProps({
  name: {
    default: '',
    type: String,
  },
  activated: {
    default: false,
    type: Boolean,
  },
})

const onChange = () => {
  emits('change', props.name)
}
</script>

<style lang="scss" module>
.nav-item {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  box-sizing: border-box;
  height: 39px;
  margin-bottom: 34px;
  padding: 7px 16px 7px 12px;
  color: var(--color-icon-default-and-secondary-text);
  font-weight: 400;
  font-size: 18px;
  border-radius: 20px;
  cursor: pointer;
  fill: var(--color-icon-default-and-secondary-text);
}

.icon-filled {
  display: none;
}

.icon-outline {
  display: block;
  width: 24px;
  height: 24px;
}

.active-nav {
  font-weight: 600;

  .icon-filled {
    display: block;
    width: 24px;
    height: 24px;
  }

  .icon-outline {
    display: none;
  }
}

.nav-item:hover {
  color: var(--color-baseline-text);
  background: var(
    --color-light-background,
    linear-gradient(0deg, rgb(79 90 255 / 10%) 0%, rgb(79 90 255 / 10%) 100%),
    #fff
  );
  fill: var(--color-baseline-text);
}

.nav-item:active {
  font-weight: 600;
  background: var(
    --color-light-background,
    linear-gradient(0deg, rgb(79 90 255 / 10%) 0%, rgb(79 90 255 / 10%) 100%),
    #fff
  );

  .icon-filled {
    display: block;
    width: 24px;
    height: 24px;
  }

  .icon-outline {
    display: none;
  }
}

.nav-item .selected {
  color: var(--color-baseline-text);
  font-weight: 600;
}

.nav-label {
  margin-left: 16px;
}

@media (prefers-color-scheme: dark) {
  .nav-item:hover {
    background-color: #585c8a;
  }
}
</style>

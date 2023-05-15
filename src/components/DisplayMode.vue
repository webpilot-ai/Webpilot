<script setup>
import {ref, watch} from 'vue'

import IllustrationPopup from './icon/IllustrationPopup.vue'
import IllustrationSidebar from './icon/IllustrationSidebar.vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: 'popUp',
  },
})

const mode = ref(props.modelValue)

const emits = defineEmits(['update:modelValue', 'change'])

watch(mode, v => {
  emits('update:modelValue', v)
  emits('change', v)
})
</script>

<template>
  <section :class="$style.webpilotRadioGroup">
    <label :class="$style.radioLabel">
      <input id="popup" v-model="mode" type="radio" value="popUp" />
      <section :class="$style.radioDesc">
        <span>Pop up</span>
        <IllustrationPopup />
      </section>
    </label>
    <label v-if="false" :class="$style.radioLabel">
      <input id="sidebar" v-model="mode" type="radio" value="sideBar" />
      <section :class="$style.radioDesc">
        <span>Side Bar</span>
        <IllustrationSidebar />
      </section>
    </label>
  </section>
</template>

<style module lang="scss">
.webpilotRadioGroup {
  display: flex;
  flex-direction: row;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;

  input {
    margin: 0;
  }
}

.radioLabel,
.radioDesc {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.radioLabel {
  cursor: pointer;

  * {
    cursor: pointer;
  }
}

.radioDesc {
  span {
    margin: 0 8px;
  }
}

.radioLabel + .radioLabel {
  margin-left: 42px;
}
</style>

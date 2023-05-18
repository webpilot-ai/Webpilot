<script setup>
import {onMounted, ref} from 'vue'

import IconOpenAi from '@/components/icon/IconOpenAi.vue'
import HelpTips from '@/components/HelpTips.vue'

const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
  },
})

const emits = defineEmits(['update:modelValue', 'change'])

const authKey = ref(props.modelValue.authKey)
const isSelfHost = ref(false)
const selfHostUrl = ref(props.modelValue.selfHostUrl)

onMounted(() => {
  if (props.modelValue.selfHostUrl !== '') {
    isSelfHost.value = true
  }
})

const onChange = () => {
  emits('update:modelValue', {
    authKey: authKey.value,
    selfHostUrl: selfHostUrl.value,
  })
}
</script>

<template>
  <div :class="stepOne.wrap">
    <div :class="stepOne.header">
      <IconOpenAi :class="stepOne.openAiIcon" />OpenAI gpt-3.5-turbo
    </div>
    <div :class="stepOne.apiKeyGuide">
      To get your API key, log into
      <a href="https://platform.openai.com/account/api-keys" target="_blank"> Open AI > API Keys</a>
      Click <b>“Create new secret key”</b>. Copy and paste key below
    </div>
    <input
      v-model="authKey"
      :class="stepOne.input"
      placeholder="Enter your API Key from OpenAI"
      type="text"
      @change="onChange"
    />
    <div :class="stepOne.selfHost">
      <input id="self_host" v-model="isSelfHost" name="self_host" type="checkbox" />
      <label for="self_host">Self Host</label>
    </div>

    <template v-if="isSelfHost">
      <input
        v-model="selfHostUrl"
        :class="stepOne.input"
        placeholder="Enter your base address"
        type="text"
        @change="onChange"
      />
      <HelpTips value="How to self host API?" />
    </template>
  </div>
</template>

<style module="stepOne" lang="scss">
.wrap {
  .openAiIcon {
    width: 24px;
    height: 24px;
    margin-right: 8px;
  }

  .header {
    display: flex;
    align-items: center;
    font-weight: 400;
    font-size: 18px;
    line-height: 25px;
  }
}

.apiKeyGuide {
  margin-top: 16px;
  color: #292929;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;

  a {
    text-decoration: none;
  }

  a:visited {
    color: #4f5aff;
  }
}

.input {
  width: 360px;
  height: 36px;
  margin-top: 12px;
  padding: 8px;
  font-size: 14px;
  line-height: 20px;
  border: 1px solid #dcdee1;
  border-radius: 5px;

  &:focus {
    outline: none;
  }
}

.selfHost {
  display: flex;
  margin-top: 18px;
  cursor: pointer;
  user-select: none;

  * {
    cursor: pointer;
  }
}
</style>

<template>
  <section :class="stepTwo.wrap">
    <WelcomeTitle @on-prev="goBack">{{ $gettext('Set up API') }}</WelcomeTitle>
    <ol :class="stepTwo.selector">
      <li
        :class="[
          stepTwo['selector__radio'],
          {[stepTwo['selector__radio--active']]: selectedOption === DEFAULT_SERVICE},
        ]"
      >
        <input
          id="option1"
          v-model="selectedOption"
          :class="stepTwo['radio-body']"
          name="option"
          type="radio"
          :value="DEFAULT_SERVICE"
          @change="handleOptionChange"
        />
        <label for="option1">{{ $gettext('Webpilot Credit') }}</label>
      </li>
      <li
        :class="[
          stepTwo['selector__radio'],
          {[stepTwo['selector__radio--active']]: selectedOption === CUSTOM_SERVICE},
        ]"
      >
        <input
          id="option2"
          v-model="selectedOption"
          :class="stepTwo['radio-body']"
          name="option"
          type="radio"
          :value="CUSTOM_SERVICE"
          @change="handleOptionChange"
        />
        <label for="option2">{{ $gettext('OpenAI Credits') }}</label>
      </li>
    </ol>
    <article>
      <section v-if="selectedOption === DEFAULT_SERVICE" :class="stepTwo.introduction">
        <article :class="stepTwo['introduction-detail']">
          <span
            >{{ $gettext('Enjoy Webpilot AI for') }} <b>{{ $gettext('FREE') }}</b></span
          >
          <span>{{ $gettext('up to 50 times/week') }}</span>
          <p>{{ $gettext('For more usage, you can add a paid plan later') }}</p>
        </article>
        <ImageFreePlan />
      </section>
      <section v-if="selectedOption === CUSTOM_SERVICE" :class="stepTwo.configuration">
        <ServerTypeSelector v-model="serverName" :class="stepTwo['dropdown-menu']" />

        <template v-if="serverName === SERVER_NAME.OPENAI_OFFICIAL">
          <WebpilotInput
            v-model="openAIOfficialForm.apiKey"
            :class="stepTwo.gap"
            placeholder="API key from OpenAI"
          />

          <article :class="[stepTwo.guide]">
            <SettingAlert :class="stepTwo['guide-content']" title="How">
              <template #desc>
                Log into
                <a href="https://platform.openai.com/account/api-keys" target="_blank">
                  Open AI > API Keys</a
                >. Click “Create new secret key”, and get yours.
              </template>
            </SettingAlert>
          </article>
        </template>

        <template v-else-if="serverName === SERVER_NAME.OPENAI_PROXY">
          <WebpilotInput
            v-model="openAiProxyForm.apiKey"
            :class="stepTwo.gap"
            placeholder="OPENAI_API_KEY"
          />
          <WebpilotInput
            v-model="openAiProxyForm.apiHost"
            :class="stepTwo.gap"
            placeholder="OPENAI_API_HOST"
          />
        </template>

        <template v-else-if="serverName === SERVER_NAME.AZURE_PROXY">
          <WebpilotInput
            v-model="azureProxyForm.apiKey"
            :class="stepTwo.gap"
            placeholder="API_KEY"
          />
          <WebpilotInput
            v-model="azureProxyForm.apiHost"
            :class="stepTwo.gap"
            placeholder="API_HOST"
          />
          <WebpilotInput
            v-model="azureProxyForm.apiVersion"
            :class="stepTwo.gap"
            placeholder="API_VERSION"
          />
          <WebpilotInput
            v-model="azureProxyForm.deploymentID"
            :class="stepTwo.gap"
            placeholder="DEPLOYMENT_ID"
          />
        </template>
      </section>
      <div v-if="isWarning" :class="stepTwo['warn-txt']">
        <WebpilotAlert :tips="errorMessage" :type="'error'" />
      </div>
      <footer :class="stepTwo['nav-btn']">
        <WebpilotButton :disabled="isFreezing" :loading="loading" :value="'NEXT'" @click="onNext" />
      </footer>
    </article>
  </section>
</template>

<script setup>
import {ref, watch, defineProps} from 'vue'

// import useStore from '@/stores/store'
import {SERVER_NAME} from '@/config'
import {$gettext} from '@/utils/i18n'
import ImageFreePlan from '@/components/image/ImageFreePlan.vue'
import SettingAlert from '@/options/components/SettingAlert.vue'
import ServerTypeSelector from '@/options/components/ServerTypeSelector.vue'
import WebpilotInput from '@/options/components/WebpilotInput.vue'
import WebpilotButton from '@/components/WebpilotButton.vue'
import WebpilotAlert from '@/components/WebpilotAlert.vue'

import WelcomeTitle from './WelcomeTitle.vue'

const DEFAULT_SERVICE = 'general'
const CUSTOM_SERVICE = 'personal'
const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({}),
  },
  isFreezing: {
    type: Boolean,
    default: true,
  },
  isWarning: {
    type: Boolean,
    default: false,
  },
  success: {
    type: Boolean,
    default: false,
  },
  error: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  errorMessage: {
    type: String,
    default: '',
  },
})
// const storeConfig = useStore()
const emits = defineEmits(['update:modelValue', 'onPrev', 'onNext', 'onRefresh'])
const goBack = () => emits('onPrev')
const onNext = () => emits('onNext')

const selectedOption = ref(
  props.modelValue.selectedOption === DEFAULT_SERVICE ? DEFAULT_SERVICE : CUSTOM_SERVICE
)
const serverName = ref(props.modelValue.serverName || SERVER_NAME.OPENAI_OFFICIAL)
const openAIOfficialForm = ref(props.modelValue.openAIOfficialForm || {apiKey: ''})
const openAiProxyForm = ref(props.modelValue.openAiProxyForm || {apiKey: '', apiHost: ''})
const azureProxyForm = ref(
  props.modelValue.azureProxyForm || {apiKey: '', apiHost: '', apiVersion: '', deploymentID: ''}
)

const handleOptionChange = event => {
  const {value} = event.target
  selectedOption.value = value
}

watch(selectedOption, newValue => {
  emits('update:modelValue', {
    ...props.modelValue,
    selectedOption: newValue,
  })
})
watch(serverName, (newValue, oldValue) => {
  if (newValue !== oldValue) {
    emits('onRefresh')
  }
  emits('update:modelValue', {
    ...props.modelValue,
    serverName: newValue,
  })
})
watch(
  openAIOfficialForm,
  newValue => {
    emits('update:modelValue', {
      ...props.modelValue,
      openAIOfficialForm: newValue,
    })
  },
  {deep: true}
)
watch(
  openAiProxyForm,
  newValue => {
    emits('update:modelValue', {
      ...props.modelValue,
      openAiProxyForm: newValue,
    })
  },
  {deep: true}
)
watch(
  azureProxyForm,
  newValue => {
    emits('update:modelValue', {
      ...props.modelValue,
      azureProxyForm: newValue,
    })
  },
  {deep: true}
)
</script>

<style module="stepTwo" lang="scss">
.selector {
  display: flex;
  justify-content: space-between;
  width: 316px;
  margin: 0 auto 24px;
  margin-top: 36px;
  padding: 0;
}

.selector__radio {
  display: flex;
  align-items: center;
  margin: 0 0 4px;
  line-height: 25px;

  label {
    width: 105px;
    font-size: 14px;
    line-height: 1;
    cursor: pointer;
  }

  &--active label {
    color: #292929;
    font-weight: 600;
  }
}

.radio-body {
  width: 16px;
  height: 16px;
  margin: 0 8px 0 0;
  border: 1px solid #4f5aff;
  border-radius: 16px;
  cursor: pointer;
  appearance: none;

  &:checked {
    position: relative;
  }

  &:checked::before {
    position: absolute;
    top: 2px;
    left: 2px;
    display: block;
    width: 10px;
    height: 10px;
    background-color: #4f5aff;
    border-radius: 50%;
    content: '';
  }
}

.introduction {
  text-align: center;
}

.introduction-detail {
  box-sizing: border-box;
  width: 377px;
  height: 98px;
  margin: 0 auto;
  padding: 12px;
  color: #292929;
  background-color: #f8faff;
  border-radius: 10px;

  span {
    display: block;
    font-weight: 400;
    font-size: 18px;
  }

  b {
    color: #4f5aff;
    font-weight: 600;
  }

  p {
    margin: 4px 0 0;
    color: #929497;
    font-weight: 400;
    font-size: 14px;
    line-height: 1;
  }
}

.configuration {
  padding-bottom: 24px;
  text-align: center;

  .gap {
    margin-top: 24px;
  }

  .dropdown-menu {
    display: inline-block;
  }

  .guide {
    width: 360px;
    margin: 24px auto 0;
  }

  .guide-content {
    text-align: left;
  }
}

.nav-btn {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-top: 88px;
}

.warn-txt {
  margin-top: 20px;
}
</style>

import {$gettext} from './utils/i18n'
// import {getOS} from './utils/index'
// const customShortcut = getOS() === 'Mac OS' ? ['Meta', '`'] : ['Control', '`']

export const WEBPILOT_CONFIG_STORAGE_KEY = 'WEBPILOT_CONFIG_STORAGE_KEY'

export const CONFIG_VERSION = 2

export const OPENAI_BASE_URL = 'https://api.openai.com'

export const API_PATH = '/v1/chat/completions'

export const PROVIDER_PROTOCOL = {
  OPENAI_CHAT: 'openai_chat',
  ANTHROPIC_MESSAGES: 'anthropic_messages',
  AZURE_OPENAI: 'azure_openai',
  CUSTOM_OPENAI_COMPATIBLE: 'custom_openai_compatible',
}

export const AUTH_TYPE = {
  BEARER: 'bearer',
  API_KEY: 'api-key',
  CUSTOM_HEADER: 'custom-header',
}

export const PROVIDER_ID = {
  OPENAI: 'OPENAI',
  CLAUDE: 'CLAUDE',
  ZAI: 'ZAI',
  AZURE: 'AZURE',
  CUSTOM: 'CUSTOM',
}

export const PROVIDER_REGISTRY = {
  [PROVIDER_ID.OPENAI]: {
    id: PROVIDER_ID.OPENAI,
    label: 'OpenAI',
    protocol: PROVIDER_PROTOCOL.OPENAI_CHAT,
    authType: AUTH_TYPE.BEARER,
    authHeaderName: 'Authorization',
    authPrefix: 'Bearer ',
    defaultBaseUrl: 'https://api.openai.com',
    defaultEndpointPath: '/v1/chat/completions',
    defaultModel: 'gpt-4o-mini',
    models: ['gpt-4o-mini', 'gpt-4.1-mini', 'gpt-4.1'],
  },
  [PROVIDER_ID.CLAUDE]: {
    id: PROVIDER_ID.CLAUDE,
    label: 'Claude',
    protocol: PROVIDER_PROTOCOL.ANTHROPIC_MESSAGES,
    authType: AUTH_TYPE.API_KEY,
    authHeaderName: 'x-api-key',
    authPrefix: '',
    defaultBaseUrl: 'https://api.anthropic.com',
    defaultEndpointPath: '/v1/messages',
    defaultModel: 'claude-3-5-sonnet-latest',
    models: ['claude-3-5-sonnet-latest', 'claude-3-7-sonnet-latest'],
  },
  [PROVIDER_ID.ZAI]: {
    id: PROVIDER_ID.ZAI,
    label: 'z.ai',
    protocol: PROVIDER_PROTOCOL.OPENAI_CHAT,
    authType: AUTH_TYPE.BEARER,
    authHeaderName: 'Authorization',
    authPrefix: 'Bearer ',
    defaultBaseUrl: '',
    defaultEndpointPath: '/v1/chat/completions',
    defaultModel: '',
    models: [],
  },
  [PROVIDER_ID.AZURE]: {
    id: PROVIDER_ID.AZURE,
    label: 'Azure OpenAI',
    protocol: PROVIDER_PROTOCOL.AZURE_OPENAI,
    authType: AUTH_TYPE.API_KEY,
    authHeaderName: 'api-key',
    authPrefix: '',
    defaultBaseUrl: '',
    defaultEndpointPath: '',
    defaultModel: 'gpt-4o-mini',
    models: ['gpt-4o-mini', 'gpt-4.1-mini'],
  },
  [PROVIDER_ID.CUSTOM]: {
    id: PROVIDER_ID.CUSTOM,
    label: 'Custom Provider',
    protocol: PROVIDER_PROTOCOL.CUSTOM_OPENAI_COMPATIBLE,
    authType: AUTH_TYPE.CUSTOM_HEADER,
    authHeaderName: 'Authorization',
    authPrefix: 'Bearer ',
    defaultBaseUrl: '',
    defaultEndpointPath: '/v1/chat/completions',
    defaultModel: '',
    models: [],
  },
}

export const createDefaultProviderConfig = () => ({
  providerId: PROVIDER_ID.OPENAI,
  protocol: PROVIDER_REGISTRY[PROVIDER_ID.OPENAI].protocol,
  apiKey: '',
  baseUrl: PROVIDER_REGISTRY[PROVIDER_ID.OPENAI].defaultBaseUrl,
  endpointPath: PROVIDER_REGISTRY[PROVIDER_ID.OPENAI].defaultEndpointPath,
  authType: PROVIDER_REGISTRY[PROVIDER_ID.OPENAI].authType,
  authHeaderName: PROVIDER_REGISTRY[PROVIDER_ID.OPENAI].authHeaderName,
  authPrefix: PROVIDER_REGISTRY[PROVIDER_ID.OPENAI].authPrefix,
  modelId: PROVIDER_REGISTRY[PROVIDER_ID.OPENAI].defaultModel,
  modelList: [...PROVIDER_REGISTRY[PROVIDER_ID.OPENAI].models],
  extraHeaders: [],
  azureApiVersion: '',
  azureDeploymentID: '',
})

export const defaultConfig = {
  configVersion: CONFIG_VERSION,
  /**
   * general: use webpilot
   * personal: use openai or third party
   * */
  apiOrigin: 'general',
  /** Open AI or selfhost api key */
  authKey: '',
  /** Is auth succeeded */
  isAuth: false,
  /** If user not set token at welcome page set false */
  isFinishSetup: false,
  /** When select text (by mouse or keyboard) show popup */
  autoPopup: false,
  /** Self host url */
  selfHostUrl: '',
  /** Unified provider config for user-supplied APIs */
  providerConfig: createDefaultProviderConfig(),
  /** Azure specify ApiVersion */
  azureApiVersion: '',
  /** Azure specify deploymentID */
  azureDeploymentID: '',
  /** Custom shortcut for show popup (akspage) */
  customShortcut: ['Control', '`'],
  /** Chose display mode
   * popUp
   * sideBar */
  displayMode: 'popUp',
  /** Show shortcut state, once trigger popup by shortcut set to false */
  showShortcutTips: true,
  /** Last select preset prompt index. For auto select at popup. */
  latestAskedQuestionPromptIndex: 0,
  latestTextSelectionPromptIndex: 0,
  /** Custom preset prompts */
  AskedQuestionPrompts: [
    {
      title: $gettext('Summarize'),
      command: $gettext('Summarize in English, concise and clear'),
    },
    {
      title: $gettext('SEO'),
      command: $gettext('Generate a list of 10 long-tail keywords for SEO, related to this page'),
    },
    {
      title: $gettext('Solve'),
      command: $gettext(
        'Find the questions/todo on the page, analyze them step by step, and provide a complete solution in the end. If a specified starting point is given, use it directly without changing.'
      ),
    },
  ],
  TextSelectionPrompts: [
    {
      title: $gettext('Explain'),
      command: $gettext('Explain it in English using words a middle schooler can understand'),
    },
    {
      title: $gettext('Refine'),
      command: $gettext(
        'Refine text, review and revise problems in spelling, grammar, punctuation, word usage, and sentence structure'
      ),
    },
    {
      title: $gettext('Draw'),
      command: $gettext(
        `Let's draw an image about this. You need to write in English without word wraps and headlines, without connection words. back to back separated with commas: [1], [2], [3], [4] {environment}, [5], [6] {style settings}
        Replace [1] with the subject "A image of ";
        Replace [2] with the sentence you mentioned;
        Replace [3] with a list of creative detailed descriptions about [element]; 
        Replace [4] with a list of detailed descriptions about the environment of the scene;
        Replace [5] with a list of detailed descriptions about the mood/feelings and atmosphere of the scene;
        Replace [6] with an appropriate director or artist. If he/she is a historical figure, include his/her country and dynasty.
        Simply write the without explanation, replace the content inside the brackets with details about the content/word inside the brackets and delete the brackets. Repeat that for every bracket in the prompt, complex prompt for an AI-based text to image program that converts a prompt about a topic into an image. The outcome depends on the prompt's coherence. The topic of the whole scene is always dependent on the subject that is replaced with [element], always start the prompt with "/imagine prompt:", don't use any line breaks, Proper grammar is unnecessary and details can be listed.
        Do not show things like "[1]""[element]" in your response.`
      ),
    },
  ],
  /* Model type, for now use open ai template */
  model: {
    model: 'gpt-4o-mini',
    temperature: 1,
    top_p: 0.9,
    frequency_penalty: 0,
    presence_penalty: 0,
    stop: '<|endoftext|>',
  },
}

export const MESSAGING_EVENT = {
  SHOW_POPUP: 'MESSAGING_EVENT',
}

export const SUPER_BUTTON_STATUS = {
  pending: 'pending',
  generating: 'generating',
  done: 'done',
}

export const WEBPILOT_OPENAI = {
  AUTH_KEY: 'KEY_PLACEHOLDER',
  HOST_URL: 'https://api.webpilotai.com/api/webpilot',
  MODEL: 'gpt-4o-mini',
}

export const LAST_PROMPT_STORAGE_KEY = {
  COMMON: 'LAST_COMMON',
  SELECTED: 'LAST_SELECTED',
}

export const API_ORIGINS = {
  /** Webpilot Server */
  GENERAL: 'general',
  /** OpenAI server or proxy */
  OPENAI: 'openAI',
  /** Selfhost server */
  OPENAI_PROXY: 'OpenAIProxy',
  /** Azure server */
  AZURE: 'azure',
}

export const SERVER_NAME = {
  OPENAI_OFFICIAL: 'OPENAI_OFFICIAL',
  OPENAI_PROXY: 'OPENAI_PROXY',
  AZURE_PROXY: 'AZURE_PROXY',
  CLAUDE: 'CLAUDE',
  ZAI: 'ZAI',
  CUSTOM: 'CUSTOM',
}

export const SERVER_TYPE = {
  [SERVER_NAME.OPENAI_OFFICIAL]: 'OpenAI Official',
  [SERVER_NAME.OPENAI_PROXY]: 'OpenAI Proxy',
  [SERVER_NAME.AZURE_PROXY]: 'Azure Proxy',
  [SERVER_NAME.CLAUDE]: 'Claude',
  [SERVER_NAME.ZAI]: 'z.ai',
  [SERVER_NAME.CUSTOM]: 'Custom Provider',
}

export const OPTIONS_PAGE_TAB_NAME = {
  ACCOUNT: 'ACCOUNT',
  EXTENSION: 'EXTENSION',
  ABOUT: 'ABOUT',
}

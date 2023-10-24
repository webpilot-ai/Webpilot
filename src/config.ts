import {$gettext} from './utils/i18n'
// import {getOS} from './utils/index'
// const customShortcut = getOS() === 'Mac OS' ? ['Meta', '`'] : ['Control', '`']

export const WEBPILOT_CONFIG_STORAGE_KEY = 'WEBPILOT_CONFIG_STORAGE_KEY'

export const OPENAI_BASE_URL = 'https://api.openai.com'

export const API_PATH = '/v1/chat/completions'

export const defaultConfig = {
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
  autoPopup: true,
  /** Self host url */
  selfHostUrl: '',
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
  AskedQuestionPrompts: [],
  TextSelectionPrompts: [
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
        'Find the questions/todo on the page, analyze them step by step, and provide a complete answer. If a specified starting point is given, use it directly without changing'
      ),
    },
  ],
  /* Model type, for now use open ai template */
  model: {
    model: 'gpt-3.5-turbo',
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
  MODEL: 'gpt-3.5-turbo',
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
}

export const SERVER_TYPE = {
  [SERVER_NAME.OPENAI_OFFICIAL]: 'OpenAI Official',
  [SERVER_NAME.OPENAI_PROXY]: 'OpenAI Proxy',
  [SERVER_NAME.AZURE_PROXY]: 'Azure Proxy',
}

import {$gettext} from './utils/i18n'

export const WEBPILOT_CONFIG_STORAGE_KEY = 'WEBPILOT_CONFIG_STORAGE_KEY'

export const OPEN_AI_API = 'https://api.openai.com/v1/chat/completions'

export const defaultConfig = {
  /** Open AI or selfhost api key */
  authKey: '',
  /** Is auth successed */
  isAuth: false,
  /** If user not set token at welcome page set false */
  isFinishSetup: false,
  /** When select text (by mouse or keyboard) show popup */
  autoPopup: true,
  /** Self host url */
  selfHostUrl: '',
  /** Custom shortcut for show popup (akspage) */
  customShortcut: ['Control', 'i'],
  /** Chose display mode
   * popUp
   * sideBar */
  displayMode: 'popUp',
  /** Last select preset prompt index. For auto select at popup. */
  latestPresetPromptIndex: 0,
  /** Show shortcut state, once trigger popup by shortcut set to false */
  showShortcutTips: true,
  /** Constom preset prompts */
  prompts: [
    {
      title: $gettext('Summarize'),
      command: $gettext('Summarize and express these words concisely'),
    },
    {
      title: $gettext('Refine'),
      command: $gettext(
        'Refine text, review and revise problems in spelling, grammar, punctuation, word usage, and sentence structure'
      ),
    },
    {
      title: $gettext('Disagree'),
      command: $gettext(
        'Identify any logical or factual errors in these texts and provide a rebuttal. At the same time, present the opposite viewpoint with supporting evidence'
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
  AUTH_KEY: 'xxxxxxxxx',
  HOST_URL: 'https://ai.api.moblin.net/api/openai/v1/chat/completions',
  MODEL: 'gpt-4',
}

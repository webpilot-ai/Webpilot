import {gettext} from './utils'

export const OPEN_AI_API = 'https://api.openai.com/v1/chat/completions'

export const FLUENTIFY_CONFIG_STORAGE_KEY = 'FLUENTIFY_CONFIG'

export const ROUTE = {
  PROMPT_BOARD_ENTRY_PANEL: '/',
  PROMPT_BOARD_PRESET_PANEL: '/preset-panel',
  PROMPT_BOARD_CUSTOM_PANEL: '/custom-panel',
}

export interface Prompt {
  title: string
  command: string
}

export const defaultConfig = {
  authKey: '',
  isAuth: false,

  autoPopup: false,
  turboMode: false,
  customCommand: '',
  latestRoute: ROUTE.PROMPT_BOARD_ENTRY_PANEL,
  latestPresetPromptIndex: 0,

  prompts: [
    {
      title: gettext('Summarize'),
      command: gettext('Summarize and express these words concisely'),
    },
    {
      title: gettext('Refine'),
      command: gettext(
        'Refine text, review and revise problems in spelling, grammar, punctuation, word usage, and sentence structure'
      ),
    },
    {
      title: gettext('Disagree'),
      command: gettext(
        'Identify any logical or factual errors in these texts and provide a rebuttal. At the same time, present the opposite viewpoint with supporting evidence'
      ),
    },
  ] as Prompt[],

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
  GET_SELECTED_TEXT: 'GET_SELECTED_TEXT',
  SET_AUTO_POPUP: 'SET_AUTO_POPUP',
  INVOKE_ASK_AI: 'INVOKE_ASK_AI',
  SYNC_FRAME_HEIGHT: 'SYNC_FRAME_HEIGHT',
  SYNC_SELECTED_TEXT: 'SYNC_SELECTED_TEXT',
  HIDE_OVERLAY: 'HIDE_OVERLAY',
  CLEAN_DATA: 'CLEAN_DATA',
}

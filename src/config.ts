import {gettext} from './utils'

export const ROUTE = {
  POPUP_ENTRY_PANEL: '/',
  POPUP_PRESET_PANEL: '/preset-panel',
  POPUP_CUSTOM_PANEL: '/custom-panel',
}

export const defaultConfig = {
  authKey: '',
  isAuth: false,
  latestRoute: ROUTE.POPUP_PRESET_PANEL,
  customCommand: '',
  prompts: [
    {
      title: gettext('Summarize'),
      command: gettext('Summarize and express these words concisely'),
    },
    {
      title: gettext('Retouch'),
      command: gettext(
        'Retouch text, review and revise problems in spelling, grammar, punctuation, word usage, and sentence structure'
      ),
    },
    {
      title: gettext('Disagree'),
      command: gettext(
        'Identify any logical or factual errors in these texts and provide a rebuttal. At the same time, present the opposite viewpoint with supporting evidence'
      ),
    },
  ],
  model: {
    model: 'gpt-3.5-turbo',
    temperature: 0,
    max_tokens: 1024,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    stop: '<|endoftext|>',
  },
}

export const MESSAGING_EVENT = {
  GET_SELECTED_TEXT: 'GET_SELECTED_TEXT',
}

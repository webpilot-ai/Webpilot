import {$gettext as gettext} from './utils/i18n'

export const WEBPILOT_CONFIG_STORAGE_KEY = 'WEBPILOT_CONFIG_STORAGE_KEY'

export const OPEN_AI_API = 'https://api.openai.com/v1/chat/completions'

export const defaultConfig = {
  authKey: '',
  isAuth: false,
  autoPopup: false,
  turboMode: false,
  customCommand: '',
  displayMode: 'popUp',
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
  ],

  model: {
    model: 'gpt-3.5-turbo',
    temperature: 1,
    top_p: 0.9,
    frequency_penalty: 0,
    presence_penalty: 0,
    stop: '<|endoftext|>',
  },
}

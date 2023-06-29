import {$gettext} from './utils/i18n'
import {getOS} from './utils/index'

const customShortcut = getOS() === 'Mac OS' ? ['Meta', '`'] : ['Control', '`']

export const WEBPILOT_CONFIG_STORAGE_KEY = 'WEBPILOT_CONFIG_STORAGE_KEY'

export const OPENAI_BASE_URL = 'https://api.openai.com'

export const API_PATH = '/v1/chat/completions'

export const defaultConfig = {
  // general | personal
  apiOrigin: 'general',
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
  customShortcut,
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
      title: $gettext('MidJourney Prompt'),
      command: $gettext(
        `Let's draw an image about this. You need to write in English without word wraps and headlines, without connection words. back to back separated with commas: [1], [element], [2], [3] {environment}, [4], [5], [6] {style settings}

        Replace [1] with the subject "A image of ";
        
        Replace [element] with the sentence you mentioned;
        
        Replace [2] with a list of creative detailed descriptions about [element];
        
        Replace [3] with a list of detailed descriptions about the environment of the scene;
        
        Replace [4] with a list of detailed descriptions about the mood/feelings and atmosphere of the scene;
        
        Replace [5] with a list of specific camera model(including specific color film type and lens details as well as techniques) set a artistic style;
        
        Replace [6] with a list of multiple directors, cinematographers, photographers, fashion designers, cartoonist or artist, who would be unlikely to collaborate but would juxtapose uniquely.
        
        Simply write the without explanation, replace the content inside the brackets with details about the content/word inside the brackets and delete the brackets. Repeat that for every bracket in the prompt, complex prompt for an AI-based text to image program that converts a prompt about a topic into an image. The outcome depends on the prompt's coherence. The topic of the whole scene is always dependent on the subject that is replaced with [element], always start the prompt with "/imagine prompt:", don't use any line breaks, Proper grammar is unnecessary and details can be listed.
        
        Do not show things like "[1]""[element]" in your response.`
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

import {createContext, useReducer} from 'react'
import {sendToContentScript} from '@plasmohq/messaging'

import {askOpenAI, parseStream} from '@/io'
import {gettext, toast} from '@/utils'
import {MESSAGING_EVENT, ROUTE} from '@/config'

import useConfig from '@/hooks/use-config'

export const AIContext = createContext({ai: null, aiDispatch: null})

export const AI_REDUCER_ACTION_TYPE = {
  REQUEST: 'REQUEST',
  SUCCESS: 'SUCCESS',
  FAILURE: 'FAILURE',
  SET_RESULT: 'SET_RESULT',
}

const initialState = {
  loading: false,
  error: null,
  result: null,
}

export function withAIContext(Component) {
  return function WithAIContext(props) {
    const [ai, aiDispatch] = useReducer(reducer, initialState)
    const {config, setConfig} = useConfig()

    const askAI = async ({authKey, command, text = '', onlyCommand = false}) => {
      let selectedText = text.trim()

      if (!onlyCommand && (!text || text === '')) {
        try {
          selectedText = await sendToContentScript({
            name: MESSAGING_EVENT.GET_SELECTED_TEXT,
          })
        } catch (e) {}

        if (!selectedText.trim()) {
          return toast.error(
            gettext('Remember to select text. If using for the first time, refresh the page')
          )
        }
      }

      aiDispatch({type: AI_REDUCER_ACTION_TYPE.REQUEST})

      return askOpenAI({
        authKey: authKey || config.authKey,
        model: config.model,
        prompt: onlyCommand ? command : `${command}:\n\n${selectedText}\n\n`,
      })
        .then(streamReader => {
          return parseStream(streamReader, result => {
            aiDispatch({type: AI_REDUCER_ACTION_TYPE.SUCCESS, payload: {result}})
          })
        })
        .catch(err => {
          aiDispatch({type: AI_REDUCER_ACTION_TYPE.FAILURE, payload: err})

          if (err.response && err.response.status === 401) {
            setConfig({...config, latestRoute: ROUTE.PROMPT_BOARD_ENTRY_PANEL, isAuth: false})
            toast.error(gettext('Auth key not available, please reset'))
          } else {
            let errorMsg = err.message || ''

            if (err?.response?.data?.error?.message) {
              errorMsg = `OpenAI: ${err.response.data.error.message}`
            }

            toast.error(errorMsg)
          }

          throw err
        })
    }

    const context = {ai, askAI, aiDispatch}

    return (
      <AIContext.Provider value={context}>
        <Component {...props} />
      </AIContext.Provider>
    )
  }
}

function reducer(state, action) {
  switch (action.type) {
    case AI_REDUCER_ACTION_TYPE.REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
        result: null,
      }

    case AI_REDUCER_ACTION_TYPE.SUCCESS:
      return {
        ...state,
        error: null,
        loading: false,
        result: action.payload.result,
      }

    case AI_REDUCER_ACTION_TYPE.FAILURE:
      return {
        ...state,
        loading: false,
        error: {
          ...action.payload,
        },
        result: null,
      }

    case AI_REDUCER_ACTION_TYPE.SET_RESULT:
      return {
        ...state,
        result: action.payload.result,
      }
  }
}

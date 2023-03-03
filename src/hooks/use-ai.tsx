import {useContext} from 'react'
import {AIContext} from '@/components/with-ai-context'

export default function useAI() {
  return useContext(AIContext)
}

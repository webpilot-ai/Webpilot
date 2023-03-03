import {useStorage} from '@plasmohq/storage/hook'

import {defaultConfig} from '@/config'

const FLUENTIFY_CONFIG_STORAGE_KEY = 'FLUENTIFY_CONFIG'

export default function useConfig() {
  const [config, setConfig] = useStorage(FLUENTIFY_CONFIG_STORAGE_KEY, val => {
    return val || defaultConfig
  })

  return {config, setConfig}
}

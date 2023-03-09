import {useStorage} from '@plasmohq/storage/hook'

import {defaultConfig, FLUENTIFY_CONFIG_STORAGE_KEY} from '@/config'

export default function useConfig() {
  const [config, setConfig] = useStorage(FLUENTIFY_CONFIG_STORAGE_KEY, val => {
    return val || defaultConfig
  })

  return {config, setConfig}
}

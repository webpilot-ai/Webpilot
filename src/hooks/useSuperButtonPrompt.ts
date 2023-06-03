import {onBeforeMount, ref} from 'vue'
import {Storage} from '@plasmohq/storage'

const storage = new Storage()
const DEFAULT_PROMPT = 'Re-write in native American English'

export default function useSuperButtonPrompt(storageKey, defaultPrompt = DEFAULT_PROMPT) {
  const prompt = ref(defaultPrompt)

  onBeforeMount(() => {
    ;(async function () {
      const superButtonPrompt = await getPrompt()

      prompt.value = superButtonPrompt
    })()
  })

  async function getPrompt() {
    const {superButtonPrompt} = await storage.get(storageKey)

    prompt.value = superButtonPrompt

    return superButtonPrompt
  }

  async function setPrompt(superButtonPrompt) {
    prompt.value = superButtonPrompt

    await storage.set(storageKey, {superButtonPrompt})

    return superButtonPrompt
  }

  return {
    superButtonPrompt: prompt,
    getSuperButtonPrompt: getPrompt,
    setSuperButtonPrompt: setPrompt,
  }
}

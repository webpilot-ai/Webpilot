import {onBeforeMount, ref} from 'vue'
import {Storage} from '@plasmohq/storage'

const storage = new Storage()

export default function useSuperButtonPrompt(storageKey, defaultPrompt) {
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

import { useState } from 'react'

export type EmbeddingType = {
  keyword: string
  name: string
  link: string
  id: number
}

export const fetchEmbeddings = async (
  prompt: string,
  dictionary: string[]
): Promise<EmbeddingType[]> => {
  const promptPieces = prompt.split(',').map((piece) => piece.trim())
  const potentialEmbeddings = promptPieces.filter(
    (piece) => piece.indexOf(' ') < 0
  )
  console.log('potentialEmbeddings', potentialEmbeddings)

  // Filter out all words from the dictionary.
  console.log('Using dictionary of length ', dictionary.length)
  const filteredEmbeddings = potentialEmbeddings.filter(
    (embedding) => dictionary.indexOf(embedding.toLowerCase()) < 0
  )
  console.log('filteredEmbeddings', filteredEmbeddings)

  const foundEmbeddings = await Promise.all(
    filteredEmbeddings.map(async (identifier) => {
      const civitaiResponse = await fetch(
        `https://civitai.com/api/v1/models\?types\=TextualInversion\&limit\=1\&query\=${identifier}`
      ).catch((e) => {
        console.log(e)
        return {
          ok: false,
          json: () => {},
        }
      })

      // Return undefined if the response was not okay or doesn't have items.
      if (!civitaiResponse.ok) return undefined
      const json = await civitaiResponse.json()
      if (!json.items || json.items.length === 0) return undefined
      const responseEmbeddings = json.items[0]

      // Make sure our identifier is an exact match for one of the found Embeddings versions.
      if (
        !responseEmbeddings.modelVersions.find(
          (version: { trainedWords: string[] }) =>
            version.trainedWords.includes(identifier)
        )
      )
        return
      const embedding: EmbeddingType = {
        keyword: identifier,
        name: responseEmbeddings.name,
        link: `https://civitai.com/models/${responseEmbeddings.id}`,
        id: responseEmbeddings.id,
      }
      return embedding
    })
  )

  const embeddings = foundEmbeddings.filter(
    (embedding) => embedding !== undefined
  ) as EmbeddingType[]

  console.log('final Embeddings', embeddings)

  return embeddings
}

export const useEmbeddings = () => {
  const [status, setStatus] = useState<
    'idle' | 'initializing' | 'loading' | 'error'
  >('idle')
  const [dictionary, setDictionary] = useState<string[]>([])

  const findEmbeddings = async (prompt: string): Promise<EmbeddingType[]> => {
    if (dictionary.length === 0) {
      setStatus('initializing')
      const dictionaryResponse = await fetch('/words.json')
      const dictionary = await dictionaryResponse.json()
      setDictionary(dictionary)
    }
    setStatus('loading')
    const embeddings = await fetchEmbeddings(prompt, dictionary)
    setStatus('idle')
    return embeddings
  }

  return { findEmbeddings, status }
}

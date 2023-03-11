// Breaking JS standards here to conform with Stable Diffusion output.
export type SDParameterType = {
  prompt: string
  negativePrompt: string
  'CFG scale': number
  Steps: number
  Sampler: string
  Seed: number
  [key: string]: string | number
}

const COMMA_PLACEHOLDER = 'COMMA_PLACEHOLDER'

export const parseRawParams = (rawParams: string): SDParameterType => {
  const rawParamsLines = rawParams.split('\n')
  const prompt = rawParamsLines[0]
  const hasNegativePrompt = rawParamsLines.length >= 3
  const negativePrompt = hasNegativePrompt
    ? rawParamsLines[1].replace('Negative prompt: ', '').trim()
    : ''

  // Handle all other params on third line.
  const additionalParamsIndex = hasNegativePrompt ? 2 : 1
  let additionalParamsLine = rawParamsLines[additionalParamsIndex]

  // Replace all commoas in additionParamsLine with placeholders by walking through the string between "s.
  if (/(".+?,.+?")/g.test(additionalParamsLine)) {
    let inQuotes = false
    let newAdditionalParamsLine = ''
    for (let i = 0; i < additionalParamsLine.length; i++) {
      const char = additionalParamsLine[i]
      if (char === '"') inQuotes = !inQuotes
      if (char === ',' && inQuotes) {
        newAdditionalParamsLine += COMMA_PLACEHOLDER
      } else {
        newAdditionalParamsLine += char
      }
    }
    additionalParamsLine = newAdditionalParamsLine
  }

  const paramStrings = additionalParamsLine.split(',')
  const paramKeysAndValues = paramStrings
    .map((line) => line.split(':'))
    .map((line) => {
      const key = line[0].trim()
      const value = line[1]
        .trim()
        .replaceAll(COMMA_PLACEHOLDER, ',')
        .replace(/"/g, '')
      return { key, value }
    })

  // Turn key-value paris into an object.
  const additionalParams = paramKeysAndValues.reduce((acc: any, line) => {
    let value: string | number = line.value
    // Parse all numeric values into numbers
    if (!isNaN(Number(value))) value = Number(line.value)
    acc[line.key] = value
    return acc
  }, {})

  const params: SDParameterType = {
    prompt,
    negativePrompt,
    ...additionalParams,
  }
  return params
}

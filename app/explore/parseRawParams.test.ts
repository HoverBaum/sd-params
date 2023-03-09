// some.test.ts
import tap from 'tap'
import { SDParameterType, parseRawParams } from './parseRawParams'

tap.test('Raw Param parsing', (t) => {
  const rawParams = `dgtlv2, character portrait, cyberpunk, shadowrun, neon
  Negative prompt: watermark, signature, plain background, horrific, mutated, monster, gross, anime
  Steps: 25, Sampler: DDIM, CFG scale: 8.5, Seed: 3778860946, Size: 512x512, Model hash: 1976397d3d, Model: model, Denoising strength: 0.55, Hires upscale: 2, Hires steps: 20, Hires upscaler: 4x_foolhardy_Remacri`

  const expected: SDParameterType = {
    prompt: 'dgtlv2, character portrait, cyberpunk, shadowrun, neon',
    negativePrompt:
      'watermark, signature, plain background, horrific, mutated, monster, gross, anime',
    'CFG scale': 8.5,
    Steps: 25,
    Sampler: 'DDIM',
    Seed: 3778860946,
    Size: '512x512',
    'Model hash': '1976397d3d',
    Model: 'model',
    'Denoising strength': 0.55,
    'Hires upscale': 2,
    'Hires steps': 20,
    'Hires upscaler': '4x_foolhardy_Remacri',
  }

  const actual = parseRawParams(rawParams)

  t.strictSame(actual, expected, 'Parsing finds basic params correctly')
  t.end()
})

tap.test('Parsing extra params in ""', (t) => {
  const rawParams = `dgtlv2, character portrait of a female human, cyberpunk, shadowrun, megacorporation forest, anxious, dramatic, backlight lighting
  Negative prompt: watermark, signature, plain background, horrific, mutated, monster, gross, anime
  Steps: 30, Sampler: DDIM, CFG scale: 8.5, Seed: 1523377376, Size: 512x512, Model hash: 1976397d3d, Model: v2.1-512, Denoising strength: 0.55, Wildcard prompt: "dgtlv2, character portrait of a __gender__ __metahuman__, cyberpunk, shadowrun, __location-modifier__ __location__, __mood__, __mood__, __light__ lighting", Hires upscale: 2, Hires steps: 20, Hires upscaler: 4x_foolhardy_Remacri, Fake Addition: "something, with commas, in it"`

  const expected: SDParameterType = {
    prompt:
      'dgtlv2, character portrait of a female human, cyberpunk, shadowrun, megacorporation forest, anxious, dramatic, backlight lighting',
    negativePrompt:
      'watermark, signature, plain background, horrific, mutated, monster, gross, anime',
    'CFG scale': 8.5,
    Steps: 30,
    Sampler: 'DDIM',
    Seed: 1523377376,
    Size: '512x512',
    'Model hash': '1976397d3d',
    Model: 'v2.1-512',
    'Denoising strength': 0.55,
    'Wildcard prompt':
      'dgtlv2, character portrait of a __gender__ __metahuman__, cyberpunk, shadowrun, __location-modifier__ __location__, __mood__, __mood__, __light__ lighting',
    'Hires upscale': 2,
    'Hires steps': 20,
    'Hires upscaler': '4x_foolhardy_Remacri',
    'Fake Addition': 'something, with commas, in it',
  }

  const actual = parseRawParams(rawParams)

  t.strictSame(
    actual,
    expected,
    'Understand params in " to be their own even with commas'
  )
  t.end()
})

import { SDParameterType } from './parseRawParams'

export const BaseParams = ({ params }: { params: SDParameterType }) => {
  return (
    <div>
      <p className="mb-2">
        <span className="block font-bold">Prompt</span>
        <span>{params.prompt}</span>
      </p>
      <p className="mb-2">
        <span className="block font-bold">Negative Prompt</span>
        <span>{params.negativePrompt}</span>
      </p>
      <div className="grid grid-cols-2 md:grid-cols-4">
        <p className="mb-2">
          <span className="block font-bold">CFG Scale</span>
          <span>{params['CFG scale']}</span>
        </p>
        <p className="mb-2">
          <span className="block font-bold">Steps</span>
          <span>{params.Steps}</span>
        </p>
        <p className="mb-2">
          <span className="block font-bold">Seed</span>
          <span>{params.Seed}</span>
        </p>
        <p className="mb-2">
          <span className="block font-bold">Sampler</span>
          <span>{params.Sampler}</span>
        </p>
      </div>
    </div>
  )
}

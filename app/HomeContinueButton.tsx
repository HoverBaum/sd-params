'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useDirHandle } from './DirHandleContext'

export const HomeContinueButton = () => {
  const { loadDirHandle, storedHandleAvailable } = useDirHandle()
  const router = useRouter()
  const [isError, setIsError] = useState(false)

  const continueWithFolder = async () => {
    const dirHandleWasLoaded = await loadDirHandle()
    if (dirHandleWasLoaded) {
      router.push('/explore')
    } else {
      setIsError(true)
    }
  }

  console.log(storedHandleAvailable)

  if (isError)
    return (
      <div className="alert alert-error shadow-lg">
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current flex-shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>Error! Failed to load folder, please open it again.</span>
        </div>
      </div>
    )

  if (!storedHandleAvailable) return null

  return (
    <button
      className="btn btn-outline ml-4"
      onClick={() => continueWithFolder()}
    >
      Continue
    </button>
  )
}

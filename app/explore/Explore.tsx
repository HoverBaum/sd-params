'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { useDirHandle } from '../DirHandleContext'
import ExifReader from 'exifreader'
import { AllParams } from './AllParams'
import { BaseParams } from './BaseParams'
import { parseRawParams, SDParameterType } from './parseRawParams'
import Fuse from 'fuse.js'

type FileType = {
  src: string
  name: string
  file: File
  parsedForParams: boolean
  paramsError?: string
  rawParams?: string
  params?: SDParameterType
}

export const Explore = () => {
  const { dirHandle } = useDirHandle()
  const [files, setFiles] = useState<FileType[]>([])
  const router = useRouter()
  const [selectedImage, setSelectedImage] = useState<FileType>()
  const [searchString, setSearchString] = useState<string>('')
  const [isUsingSearch, setIsUsingSearch] = useState<boolean>(false)
  const [images, setImages] = useState<FileType[]>([])

  const paramsForFile = async (file: File) => {
    const exifReaderData = await ExifReader.load(file)

    if (!exifReaderData.parameters)
      return {
        parsedForParams: true,
        paramsError: 'No parameters found in image',
      }
    const rawParams = exifReaderData.parameters.description as string

    const params = parseRawParams(rawParams)
    return {
      parsedForParams: true,
      rawParams,
      params,
    }
  }

  // Scroll #imageDisplay to top when image changes.
  useEffect(() => {
    const imageDisplay = document.getElementById('imageDisplay')
    if (imageDisplay) imageDisplay.scrollTop = 0
  }, [selectedImage])

  // Clear search string when search is closed.
  useEffect(() => {
    if (!isUsingSearch) setSearchString('')
  }, [isUsingSearch])

  // Filter images when search string changes.
  useEffect(() => {
    setSelectedImage(undefined)

    if (searchString === '') {
      setImages(files)
    } else {
      // Find all matches using fuse
      const fuse = new Fuse(files, {
        // Lowering the default threshold, this onyl matches things close to the query.
        threshold: 0.3,
        // Only start matching from 2 chars onwards.
        minMatchCharLength: 2,
        // We want to filter and keep original order.
        shouldSort: false,
        keys: ['params.prompt'],
      })
      const filterResults = fuse
        .search(searchString)
        .map((result) => result.item)
      setImages(filterResults)
    }
  }, [files, searchString])

  // Load all files or direct pack to landing page if no dirHandler.
  const loadImages = async () => {
    setFiles([])
    const files: FileType[] = []
    if (!dirHandle) return router.push('/')
    for await (const [key, value] of dirHandle.entries()) {
      if (value.kind === 'file') {
        const file = await value.getFile()
        if (file.type.startsWith('image/')) {
          const paramsData = await paramsForFile(file)
          const fileData: FileType = {
            src: URL.createObjectURL(file),
            name: file.name,
            file,
            ...paramsData,
          }
          files.push(fileData)
        }
      }
    }
    setFiles(files)
  }

  // Initially load all images from dirHandle.
  useEffect(() => {
    loadImages()
  }, [])

  return (
    <div className="w-screen h-screen grid grid-cols-1">
      <div className="border-b-2 shadow">
        <div className="navbar bg-base-100">
          <div className="flex-1">
            <Link href="/" className="btn btn-ghost normal-case text-xl">
              Param Explorer
            </Link>
            <span>Exploring: {dirHandle?.name}</span>
          </div>
          <div className="flex-none">
            <button
              className="btn btn-outline btn-sm mr-4"
              onClick={() => loadImages()}
            >
              Reload folder
            </button>
            <button
              className="btn btn-outline btn-sm"
              onClick={() => setIsUsingSearch((value) => !value)}
            >
              Toggle Search
            </button>
          </div>
        </div>

        {isUsingSearch && (
          <div className="p-2">
            <input
              type="text"
              placeholder="Search prompts"
              className="input input-bordered w-full max-w-xs"
              onChange={(e) => setSearchString(e.target.value)}
            />
          </div>
        )}
      </div>

      <div className="grid grid-cols-12 overflow-hidden">
        <div className="animate-fadeIn overflow-y-scroll py-2 h-full px-4 col-span-4 grid grid-cols-3 xl:grid-cols-4 gap-2 auto-rows-min border-r-2">
          {/* While there are no images yet, we display a Skeleton. */}
          {!files.length &&
            Array.from({ length: 17 }, (_, index) => index + 1).map((i) => (
              <div className="animate-pulse bg-base-300 h-[9rem]" key={i}></div>
            ))}

          {images.map((file) => (
            <div key={file.name} className="animate-fadeIn">
              <img
                src={file.src}
                alt={file.name}
                onClick={() => {
                  setSelectedImage(file)
                }}
                className={`${
                  selectedImage &&
                  selectedImage.name === file.name &&
                  'border-4 border-primary'
                }`}
              />
            </div>
          ))}
        </div>

        {/* Image display */}
        <div
          className="col-span-8 p-4 overflow-y-scroll pt-2"
          id="imageDisplay"
        >
          {selectedImage && (
            <div className="grid grid-cols-2 gap-4">
              <img
                className="w-[512px]"
                src={selectedImage.src}
                alt={selectedImage.name}
              />

              {selectedImage.params && (
                <div>
                  <BaseParams params={selectedImage.params} />
                  <button
                    className="btn btn-block btn-outline mt-4"
                    onClick={() => {
                      if (!selectedImage.rawParams) return
                      navigator.clipboard
                        .writeText(selectedImage.rawParams)
                        .then(
                          () => {
                            /* clipboard successfully set */
                          },
                          () => {
                            /* clipboard write failed */
                          }
                        )
                    }}
                  >
                    Copy generation data
                  </button>
                </div>
              )}
            </div>
          )}

          <div className="mt-4">
            {selectedImage && selectedImage.params && (
              <AllParams params={selectedImage.params} />
            )}
          </div>

          {/* Error case */}
          {selectedImage && selectedImage.paramsError && (
            <div className="p-4">
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
                  <span>{selectedImage.paramsError}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

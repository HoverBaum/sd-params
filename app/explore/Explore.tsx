'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useDirHandle } from '../DirHandleContext'
import ExifReader from 'exifreader'
import { AllParams } from './AllParams'
import { BaseParams } from './BaseParams'
import { parseRawParams, SDParameterType } from './parseRawParams'

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

  useEffect(() => {
    if (!selectedImage) return
    if (selectedImage.parsedForParams) return
    const parseData = async () => {
      const exifReaderData = await ExifReader.load(selectedImage.file)

      const rawParams = exifReaderData.parameters.value as string
      if (!rawParams)
        return setSelectedImage({
          ...selectedImage,
          parsedForParams: true,
          paramsError: 'No parameters found in image',
        })

      const params = parseRawParams(rawParams)
      setSelectedImage({
        ...selectedImage,
        parsedForParams: true,
        rawParams,
        params,
      })
    }
    parseData()
  }, [selectedImage])

  useEffect(() => {
    const loadImages = async () => {
      const files: FileType[] = []
      if (!dirHandle) return router.push('/')
      for await (const [key, value] of dirHandle.entries()) {
        if (value.kind === 'file') {
          const file = await value.getFile()
          file.type.startsWith('image/') &&
            files.push({
              src: URL.createObjectURL(file),
              name: file.name,
              file,
              parsedForParams: false,
            })
        }
      }
      setFiles(files)
    }
    loadImages()
  }, [dirHandle, router])

  return (
    <div className="w-screen h-screen grid grid-cols-12">
      <div className="navbar bg-base-100 col-span-12">
        <Link href="/" className="btn btn-ghost normal-case text-xl">
          Param Explorer
        </Link>
        <span>Exploring: {dirHandle?.name}</span>
      </div>
      <div className="col-span-4 overflow-y-scroll grid grid-cols-3 gap-2">
        {files.map((file) => (
          <div
            key={file.name}
            className={`${
              selectedImage &&
              selectedImage.name === file.name &&
              'border-4 border-primary'
            }`}
          >
            <img
              src={file.src}
              alt={file.name}
              onClick={() => {
                setSelectedImage(file)
              }}
            />
          </div>
        ))}
      </div>

      {/* Image display */}
      <div className="col-span-8 p-4 overflow-y-scroll">
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
                    navigator.clipboard.writeText(selectedImage.rawParams).then(
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
  )
}

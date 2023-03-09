'use client'

import { useRouter } from 'next/navigation'
import { useDirHandle } from './DirHandleContext'

export const HomeButton = () => {
  const { setDirHandle } = useDirHandle()
  const router = useRouter()

  const openFolder = async () => {
    const dirHandle = await window.showDirectoryPicker()
    setDirHandle(dirHandle)
    // console.log(dirHandle)
    // for await (const [key, value] of dirHandle.entries()) {
    //   console.log({ key, value })
    //   value.kind === 'file' && console.log(await value.getFile())
    // }
    router.push('/explore')
  }

  return (
    <button className="btn btn-primary" onClick={() => openFolder()}>
      Open folder
    </button>
  )
}

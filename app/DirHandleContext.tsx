/**
 * React Context to store the current FileSystemDirectoryHandle of the
 * directory opened by the user.
 */

import { createContext, useContext, useEffect, useState } from 'react'
import { getHandle, putHandle } from './dirHandleDB'

const defaultDirHandleContextValue = {
  dirHandle: null as FileSystemDirectoryHandle | null,
  storedHandleAvailable: false,
  setDirHandle: (dirHandle: FileSystemDirectoryHandle) => {},
  loadDirHandle: async () => false,
}

type DirHandleContextType = typeof defaultDirHandleContextValue

export const DirHandleContext = createContext<DirHandleContextType>(
  defaultDirHandleContextValue
)

export const DirHandleProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [dirHandle, setDirHandleState] =
    useState<FileSystemDirectoryHandle | null>(null)
  const [storedHandleAvailable, setStoredHandleAvailable] = useState(false)

  const setDirHandle = (dirHandle: FileSystemDirectoryHandle) => {
    setDirHandleState(dirHandle)
    putHandle(dirHandle).then(() => {
      setStoredHandleAvailable(true)
    })
  }

  const loadDirHandle = async () => {
    const handle = await getHandle()
    if (handle) {
      setDirHandle(handle)
      return true
    }
    return false
  }

  // Initially check if there is a handle stored.
  useEffect(() => {
    const testForHandle = async () => {
      const handle = await getHandle()
      if (handle) {
        setStoredHandleAvailable(true)
      }
    }
    testForHandle()
  }, [])

  return (
    <DirHandleContext.Provider
      value={{ dirHandle, setDirHandle, storedHandleAvailable, loadDirHandle }}
    >
      {children}
    </DirHandleContext.Provider>
  )
}

export const useDirHandle = () => {
  return useContext(DirHandleContext)
}

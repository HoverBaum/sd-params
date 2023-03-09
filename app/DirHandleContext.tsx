/**
 * React Context to store the current FileSystemDirectoryHandle of the
 * directory opened by the user.
 */

import React from 'react'

const defaultDirHandleContextValue = {
  dirHandle: null as FileSystemDirectoryHandle | null,
  setDirHandle: (dirHandle: FileSystemDirectoryHandle) => {},
}

type DirHandleContextType = typeof defaultDirHandleContextValue

export const DirHandleContext = React.createContext<DirHandleContextType>(
  defaultDirHandleContextValue
)

export const DirHandleProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [dirHandle, setDirHandle] =
    React.useState<FileSystemDirectoryHandle | null>(null)

  return (
    <DirHandleContext.Provider value={{ dirHandle, setDirHandle }}>
      {children}
    </DirHandleContext.Provider>
  )
}

export const useDirHandle = () => {
  const { dirHandle, setDirHandle } = React.useContext(DirHandleContext)
  return { dirHandle, setDirHandle }
}

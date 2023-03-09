'use client'

import { DirHandleProvider } from './DirHandleContext'

export default function GlobalProviders({
  children,
}: {
  children: React.ReactNode
}) {
  return <DirHandleProvider>{children}</DirHandleProvider>
}

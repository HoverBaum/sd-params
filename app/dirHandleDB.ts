/**
 * This module provides a simple database for storing a single
 * FileSystemDirectoryHandle. It is used to enable users to
 * continue browsing the same directory after a page reload.
 * Thank you ChatGPT ^^
 */

type StoredHandle = {
  id: 42
  handle: FileSystemDirectoryHandle
}

const dbName = 'sdParamsDB'
const objectStoreName = 'handles'
const keyPath = 'id'

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(dbName, 1)
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)
    request.onupgradeneeded = (event) => {
      const db = request.result
      if (!db.objectStoreNames.contains(objectStoreName)) {
        db.createObjectStore(objectStoreName, { keyPath })
      }
    }
  })
}

export async function putHandle(
  handle: FileSystemDirectoryHandle
): Promise<void> {
  const db = await openDatabase()
  const transaction = db.transaction(objectStoreName, 'readwrite')
  const objectStore = transaction.objectStore(objectStoreName)
  const handleToStore: StoredHandle = {
    id: 42,
    handle,
  }
  objectStore.put(handleToStore)
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve()
    transaction.onerror = () => reject(transaction.error)
  })
}

export async function getHandle(): Promise<
  FileSystemDirectoryHandle | undefined
> {
  const db = await openDatabase()
  const transaction = db.transaction(objectStoreName, 'readonly')
  const objectStore = transaction.objectStore(objectStoreName)
  const request = objectStore.get(42)
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve(request.result?.handle)
    transaction.onerror = () => reject(transaction.error)
  })
}

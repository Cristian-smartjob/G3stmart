'use client'
import { useEffect, useRef, useState } from 'react'
import { Provider } from 'react-redux'
import { makeStore, AppStore } from '../lib/store'

export default function StoreProvider({
  children
}: {
  children: React.ReactNode
}) {

  const storeRef = useRef<AppStore | null>(null)
  const [isStoreReady, setIsStoreReady] = useState(false)

  useEffect(() => {
    if (!storeRef.current) {
      storeRef.current = makeStore()
      setIsStoreReady(true) 
    }
  }, [])

  if (!isStoreReady) {
    return null 
  }
  return (
    <Provider store={storeRef.current!}>{children}</Provider>
  )
}
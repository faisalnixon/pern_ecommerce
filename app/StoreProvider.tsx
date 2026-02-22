'use client'

import { useRef, ReactNode } from 'react'
import { Provider } from 'react-redux'
import { makeStore, AppStore } from '../lib/store'

interface StoreProviderProps {
  children: ReactNode
}

export default function StoreProvider({ children }: StoreProviderProps) {
  const storeRef = useRef<AppStore | null>(null)

  if (!storeRef.current) {
    storeRef.current = makeStore()
  }

  return (
    <Provider store={storeRef.current}>
      {children}
    </Provider>
  )
}



// 'use client'
// import { useRef } from 'react'
// import { Provider } from 'react-redux'
// import { makeStore } from '../lib/store'

// export default function StoreProvider({ children }) {
//   const storeRef = useRef(undefined)
//   if (!storeRef.current) {
//     // Create the store instance the first time this renders
//     storeRef.current = makeStore()
//   }

//   return <Provider store={storeRef.current}>{children}</Provider>;
// }
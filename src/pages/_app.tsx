import '@/styles/global.sass'
import type { AppProps } from 'next/app'

import { AuthProvider } from '../contexts/AuthContext'

// react toastify
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
      <ToastContainer autoClose={3000}/>
    </AuthProvider>
  )
}

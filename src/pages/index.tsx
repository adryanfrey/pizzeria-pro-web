// html elements
import Head from 'next/head'

// sass
import styles from '@/styles/home.module.sass'

// components
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'

// hooks
import Link from 'next/link'
import { useContext, FormEvent, useState } from 'react'
import { GetServerSidePropsContext } from 'next'
import { LoadingPage } from '@/components/ui/LoadingPage/indext'
import { parseCookies } from 'nookies'

// contexts
import { AuthContext } from '../contexts/AuthContext'

export default function Home() {
  // states
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingDemo, setLoadingDemo] = useState(false)

  const { signIn } = useContext(AuthContext)

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault()
    let data = { email, password }

    setLoading(true)
    await signIn(data)
    setLoading(false)
  }

  const handleDemoSignIn = async () => {
    setLoadingDemo(true)
    await signIn({ email: '', password: '', demo: true })
    setLoadingDemo(false)
  }

  if (loadingDemo) {
    return (
      <LoadingPage />
    )
  }

  return (
    <>
      <Head>
        <title>Pizzeria - Login</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.containerCenter}>
        <h1>Pizzeria<span>Pro</span></h1>

        <div className={styles.login}>
          <form onSubmit={(e) => handleLogin(e)}>
            <Input placeholder='Enter your email' type='text' required value={email} onChange={(e) => setEmail(e.target.value)} />
            <Input placeholder='Your Password' type='password' required value={password} onChange={(e) => setPassword(e.target.value)} />
            <Button type='submit' loading={loading}>
              Login
            </Button>
          </form>

          <Link className={styles.link} href='/signup'>
            Dont have an account? Register
          </Link>
          <p onClick={handleDemoSignIn} className={styles.link}>
            Try demo account!
          </p>

        </div>
      </main>
    </>
  )
}


// check user Authentication 
export const getServerSideProps = (ctx: GetServerSidePropsContext) => {
  const cookies = parseCookies(ctx)

  if (cookies['@pizzeriaProToken']) {
      return {
          redirect: {
              destination: '/dashboard',
              permanent: false
          }
      }
  }

  return {
      props: {

      }
  }
} 
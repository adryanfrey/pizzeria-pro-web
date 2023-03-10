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
import { GetServerSideProps } from 'next'
import { api } from '@/services/apiClient'
import { parseCookies } from 'nookies'

// contexts
import { AuthContext } from '../contexts/AuthContext'

export default function Home() {
  // states
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const { signIn } = useContext(AuthContext)

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault()
    let data = { email, password }

    setLoading(true)

    await signIn(data)

    setLoading(false)
  }

  const handleDemoSignIn = async () => {
    await signIn({email: '', password: '', demo: true})
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
            <Input placeholder='Enter your email' type='text'  required value={email} onChange={(e) => setEmail(e.target.value)}/>
            <Input placeholder='Your Password' type='password' required value={password} onChange={(e) => setPassword(e.target.value)}/>
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

export const getServerSideProps: GetServerSideProps = async (ctx) => {
 
  return{
    props: {
      
    }
  }
}
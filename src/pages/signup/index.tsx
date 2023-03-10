import Head from 'next/head'
import Image from 'next/image'

// sass
import styles from './styles.module.sass'

// components
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'

// hooks
import Link from 'next/link'
import {useContext, FormEvent, useState } from 'react'
import { AuthContext } from '@/contexts/AuthContext'
import { toast } from 'react-toastify'
import { GetServerSideProps } from 'next'

export default function SignUp() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
 
  const { signUp } = useContext(AuthContext)

  const handleSignUp = async (e: FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {

      toast.warn('Password should be the same')
      return
    }

    if(password.length < 6) {
      return toast.warn('Password should have at least 6 characters')
    }


    setLoading(true)

    await signUp({name, email, password})

    setLoading(false)
  }

  return (
    <>
      <Head>
        <title>Pizzeria - Register</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.containerCenter}>
        <h1>Pizzeria<span>Pro</span></h1>

        <div className={styles.login}>
          <form onSubmit={(e) => handleSignUp(e)}>
            <Input placeholder='Company name' type='text' value={name} onChange={(e) => setName(e.target.value)} required/>
            <Input placeholder='Your email' type='email' value={email} onChange={(e) => setEmail(e.target.value)} required/>
            <Input placeholder='Your Password' type='password' value={password} onChange={(e) => setPassword(e.target.value)} required/>
            <Input placeholder='Confirm Password' type='password' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required/>
            <Button type='submit' loading={loading}>
              Register
            </Button>
          </form>

          <Link className={styles.link} href='/'>
            Already have an account? Login
          </Link>

        </div>
      </main>
    </>
  )
}
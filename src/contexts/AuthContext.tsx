import { createContext, ReactNode, useState, useEffect } from "react";
import { destroyCookie, setCookie, parseCookies } from "nookies";
import Router from "next/router";
import { toast } from 'react-toastify'

import { api } from "@/services/apiClient";

type AuthContextData = {
    user: UserProps
    isAuthenticated: boolean
    signIn: (credentials: SignInProps) => Promise<void>
    signOut: () => void
    signUp: (credentials: signUpProps) => void
}

type UserProps = {
    id: string
    name: string
    email: string
}

type SignInProps = {
    email: string
    password: string
    demo?: boolean
}

type AuthProviderProps = {
    children: ReactNode
}

type signUpProps = {
    name: string
    email: string
    password: string
}

export const AuthContext = createContext({} as AuthContextData)

export function signOut() {
    try {
        destroyCookie(undefined, '@nextauth.token')
        destroyCookie(undefined, '@userID')
        Router.push('/')
    } catch (error) {

    }
}

export function AuthProvider({ children }: AuthProviderProps) {

    const [user, setUser] = useState<UserProps>({ id: '', name: '', email: '' })
    const isAuthenticated = !!user.id

    useEffect(() => {
        api.get('/me').then((response) => {
            const { name, email, id } = response.data

            setUser({ id, name, email })
        })
            .catch(() => {
                signOut()
            })
    }, [])

    async function signIn({ email, password, demo = false }: SignInProps) {


        // login user for demo account

        if (demo === true) {
            try {
                const response = await api.post('/session', {
                    email: 'pizzeriaPro@demo',
                    password: '123123'
                })

                const { id, name, token } = response.data

                setCookie(undefined, '@nextauth.token', token, {
                    maxAge: 60 * 60 * 24 * 30,  // expira em 1 mes
                    path: '/'   // quais caminhos terao acesso ao cookie. '/' significa todos
                })

                setCookie(undefined, '@userID', id, {
                    maxAge: 60 * 60 * 24 * 30,
                    path: '/'
                })

                setUser({
                    id,
                    name,
                    email
                })

                api.defaults.headers['Authorization'] = `Bearer ${token}`

                toast.success('Welcome')

                Router.push('/dashboard')

            } catch (error: any) {
                console.log(error)
                const message = JSON.stringify(error.request.responseText)
                if (message.includes('User not')) {
                    toast.warn('User not found')
                    return
                }

                if (message.includes('Incorret password')) {
                    toast.warn('Incorret password')
                    return
                }

                toast.warn('There was an error, try again later')
            }

            return
        }

        // login normal user
        try {
            const response = await api.post('/session', {
                email,
                password
            })

            const { id, name, token } = response.data

            setCookie(undefined, '@nextauth.token', token, {
                maxAge: 60 * 60 * 24 * 30,  // expira em 1 mes
                path: '/'   // quais caminhos terao acesso ao cookie. '/' significa todos
            })

            setCookie(undefined, '@userID', id, {
                maxAge: 60 * 60 * 24 * 30,
                path: '/'
            })

            setUser({
                id,
                name,
                email
            })

            api.defaults.headers['Authorization'] = `Bearer ${token}`

            toast.success('Welcome')

            Router.push('/dashboard')

        } catch (error: any) {
            console.log(error)
            const message = JSON.stringify(error.request.responseText)
            if (message.includes('User not')) {
                toast.warn('User not found')
                return
            }

            if (message.includes('Incorret password')) {
                toast.warn('Incorret password')
                return
            }

            toast.warn('There was an error, try again later')
        }
    }

    async function signUp({ name, email, password }: signUpProps) {
        try {
            const response = await api.post('/users', {
                name,
                email,
                password
            })

            toast.success('Account created succesfully')

            Router.push('/')
        } catch (error: any) {
            console.log(error)
            const message = JSON.stringify(error.request.responseText)
            if (message.includes('Email already')) {
                return toast.warn('Email already registered')
            }
            toast.error('There was an error, try again later')
        }
    }

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, signIn, signOut, signUp }}>
            {children}
        </AuthContext.Provider>
    )
} 
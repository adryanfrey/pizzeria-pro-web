import { createContext, ReactNode, useState, useEffect } from "react";
import { destroyCookie, setCookie, parseCookies } from "nookies";
import Router from "next/router";
import { toast } from 'react-toastify'
import { api } from "@/services/apiClient";

type AuthContextData = {
    user: UserProps
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
    destroyCookie(undefined, '@pizzeriaProToken')
    Router.push('/')
}

export function AuthProvider({ children }: AuthProviderProps) {

    const [user, setUser] = useState({} as UserProps)

    // check token && get user data on reload
    useEffect(() => {
        const cookies = parseCookies()

        if (cookies['@pizzeriaProToken']) {

            api.get('/me').then(response => {
                const {id, name, email} = response.data
                setUser({id, name, email})

            })
            .catch(() => {
                signOut()
            })

        }
    },[])

    async function signIn({ email, password, demo = false }: SignInProps) {
        // login user for demo account
        if (demo) {
            try {
                const response = await api.post('/session', {
                    email: 'pizzeriaPro@demo',
                    password: '123123'
                })

                const { id, name, token } = response.data

                setCookie(undefined, '@pizzeriaProToken', token, {
                    maxAge: 60 * 60 * 24 * 30,  // expira em 1 mes
                    path: '/'   // quais caminhos terao acesso ao cookie. '/' significa todos
                })

                setUser({
                    id,
                    name,
                    email
                })

                api.defaults.headers['Authorization'] = `Bearer ${token}`
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

            setCookie(undefined, '@pizzeriaProToken', token, {
                maxAge: 60 * 60 * 24 * 30,  // expira em 1 mes
                path: '/'   // quais caminhos terao acesso ao cookie. '/' significa todos
            })

            setUser({
                id,
                name,
                email
            })

            api.defaults.headers['Authorization'] = `Bearer ${token}`
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
        <AuthContext.Provider value={{ user, signIn, signOut, signUp }}>
            {children}
        </AuthContext.Provider>
    )
} 
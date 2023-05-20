import axios, { AxiosError } from 'axios'
import { parseCookies } from 'nookies'
import { signOut } from '@/contexts/AuthContext'

export function setupApiClient(ctx: any){
    let cookies = parseCookies(ctx)

    const api = axios.create({
        baseURL: 'https://pizzeriapro.cyclic.app',
        headers: {
            Authorization: `Bearer ${cookies['@nextauth.token']}`
        }
    })

    api.interceptors.response.use(response => {
        return response
    }, (error: AxiosError) => {
        if (error.response?.status === 401){
            if (typeof window !== undefined){
                signOut()
            } else {
                return Promise.reject(error)
            }
        }

        return Promise.reject(error)
    })

    return api
}
// sass
import styles from './styles.module.sass'

// hooks
import { useState } from 'react'
import { parseCookies } from 'nookies'
import { GetServerSideProps } from 'next'
import { canSSRAuth } from '@/utils/canSSRAuth'
import { FiRefreshCcw } from 'react-icons/fi'
import { BiRightArrowAlt } from 'react-icons/bi'
import Modal from 'react-modal'
import { ModalOrder } from '@/components/ModalOrder'

// api
import { api } from '@/services/apiClient'

// html
import Head from 'next/head'

// components
import Header from '@/components/Header'
import { setupApiClient } from '@/services/api'
import { toast } from 'react-toastify'

type OrderProps = {
    id: string
    status: string
    table: string
    draft: string
    name?: string
    created_at: string
    updated_at: string
}

interface ServerSideProps {
    ordersList: OrderProps[]
    user_id: string
}

export type OrderItemProps = {
    id: string
    amount: number
    order_id: string
    product_id: string
    product: {
        id: string
        name: string
        description: string
        banner: string
        price: string
    }
    order: {
        id: string
        table: string | number
        status: boolean
        name: string | null
    }
}

export default function Dashboard({ ordersList, user_id }: ServerSideProps) {
    const [orders, setOrders] = useState(ordersList || [])
    const [deg, setDeg] = useState(0)
    const [modalItem, setModalItem] = useState<OrderItemProps[]>()
    const [modalVisible, setModalVisible] = useState(false)

    const handleCloseModal = () => {
        setModalVisible(false)
    }

    const handleModalView = async (orderId: string) => {
        const response = await api.get('/order/detail',{
            params: {
                order_id: orderId
            }
        })

        setModalItem(response.data)
        setModalVisible(true)
    }

    const refreshOrders = async () => {
        // animation
        const icon = document.querySelector('.refresh-icon') as HTMLElement

        icon.style.transform = `rotate(${deg - 360}deg)`
        setDeg(deg - 360)

        const response = await api.get('/order', {
            params: {
                user_id: user_id
            }
        })

        setOrders(response.data)
    }

    const handleFinishOrder = async (id: string) => {

        if (user_id === 'adda52bb-4f3e-4005-910e-a5b323a66094') {

            return toast.warn('Create an account to start using the app')
        }

        const response = await api.put('/order/finish', {
            order_id: id
        })

        toast.success('Order completed')
        setModalVisible(false)
        setOrders(orders.filter((item) => item.id !== id))
    }

    Modal.setAppElement('#__next')

    return (
        <>
            <Head>
                <title>Dashboard - Pizzeria</title>
            </Head>
            <Header />
            <main className={styles.container}>
                <div className={styles.containerHeader}>
                    <h1>Last Orders</h1>
                    <button onClick={refreshOrders}>
                        <FiRefreshCcw color='#3fffa3' size={25} className='refresh-icon'/>
                    </button>
                </div>

                <article>
                    {orders.length === 0 && (
                        <span className={styles.emptyList}>No order at moment...</span>
                    )}
                    {orders.map((order) => (
                        <section key={order.id} onClick={() => handleModalView(order.id)}>
                            <div className={styles.tag}></div>
                            <span>Table {order.table}</span>
                            <p className={styles.details}>See details <BiRightArrowAlt /></p>
                        </section>
                    ))}
                </article>
                { modalVisible && 
                    <ModalOrder isOpen={modalVisible} onRequestClose={handleCloseModal} order={modalItem} handleFinishOrder={handleFinishOrder}/>
                }
            </main>
        </>
    )
}

export const getServerSideProps: GetServerSideProps = canSSRAuth(async (ctx) => {

    const api = setupApiClient(ctx)

    let cookies = parseCookies(ctx)

    console.log(cookies['@userID'])

    const response = await api.get('/order', {
        params: {
            user_id: cookies['@userID']
        }
    })

    return {
        props: {
            ordersList: response.data,
            user_id: cookies['@userID']
        }
    }
})

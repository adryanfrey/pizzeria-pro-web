// sass
import styles from './styles.module.sass'

// hooks
import { useEffect, useState, useContext } from 'react'
import { AuthContext } from '@/contexts/AuthContext'
import { parseCookies } from 'nookies'
import { GetServerSidePropsContext } from 'next'
import { FiRefreshCcw } from 'react-icons/fi'
import { BiRightArrowAlt } from 'react-icons/bi'
import Modal from 'react-modal'
import { ModalOrder } from '@/components/ModalOrder'
import { FaSpinner } from 'react-icons/fa'
import { toast } from 'react-toastify'
import Head from 'next/head'

// api
import { api } from '@/services/apiClient'

// components
import Navbar from '@/components/Navbar'

type OrderProps = {
    id: string
    status: string
    table: string
    draft: string
    name?: string
    created_at: string
    updated_at: string
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

export default function Dashboard() {
    const [orders, setOrders] = useState<OrderProps[]>()
    const [deg, setDeg] = useState(0)
    const [modalItem, setModalItem] = useState<OrderItemProps[]>()
    const [modalVisible, setModalVisible] = useState(false)
    const [loading, setLoading] = useState(true)

    const {user} = useContext(AuthContext)

    // load orders on first load
    useEffect(() => {
        async function getOrders() {
            const response = await api.get('/order', {
                params: {
                    user_id: user.id
                }
            })
            setOrders(response.data)
            setLoading(false)
        }

        getOrders()
    }, [])



    const handleCloseModal = () => {
        setModalVisible(false)
    }

    const handleModalView = async (orderId: string) => {
        setLoading(true)
        
        const response = await api.get('/order/detail', {
            params: {
                order_id: orderId
            }
        })

        setModalItem(response.data)
        setModalVisible(true)
        setLoading(false)
    }

    const refreshOrders = async () => {
        setLoading(true)
        setOrders([])
        // animation
        const icon = document.querySelector('.refresh-icon') as HTMLElement

        icon.style.transform = `rotate(${deg - 360}deg)`
        setDeg(deg - 360)

        const response = await api.get('/order', {
            params: {
                user_id: user.id
            }
        })

        setOrders(response.data)
        setLoading(false)
    }

    const handleFinishOrder = async (id: string) => {

        if (user.id === 'adda52bb-4f3e-4005-910e-a5b323a66094') {

            return toast.warn('Create an account to start using the app')
        }

        const response = await api.put('/order/finish', {
            order_id: id
        })

        toast.success('Order completed')
        setModalVisible(false)
        setOrders(orders?.filter((item) => item.id !== id))
    }

    Modal.setAppElement('#__next')

    return (
        <>
            <Head>
                <title>Dashboard - Pizzeria</title>
            </Head>
            <Navbar />
            <main className={styles.container}>
                <div className={styles.containerHeader}>
                    <h1>Last Orders</h1>
                    <button onClick={refreshOrders}>
                        <FiRefreshCcw color='#3fffa3' size={25} className='refresh-icon' />
                    </button>
                </div>

                <article>
                    {loading && <FaSpinner className={styles.spinner} size={30} color='#ff3f4b'/>}
                    {orders?.length === 0 && !loading && (
                        <span className={styles.emptyList}>No order at the moment...</span>
                    )}
                    {orders?.map((order) => (
                        <section key={order.id} onClick={() => handleModalView(order.id)}>
                            <div className={styles.tag}></div>
                            <span>Table {order.table}</span>
                            <p className={styles.details}>See details <BiRightArrowAlt /></p>
                        </section>
                    ))}
                </article>
                {modalVisible &&
                    <ModalOrder isOpen={modalVisible} onRequestClose={handleCloseModal} order={modalItem} handleFinishOrder={handleFinishOrder} />
                }
            </main>
        </>
    )
}


// check user Authentication 
export const getServerSideProps = (ctx: GetServerSidePropsContext) => {
    const cookies = parseCookies(ctx)

    if (!cookies['@pizzeriaProToken']) {
        return {
            redirect: {
                destination: '/',
                permanent: false
            }
        }
    }

    return {
        props: {

        }
    }
} 
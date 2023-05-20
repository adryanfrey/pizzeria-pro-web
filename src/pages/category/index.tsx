// sass
import styles from './styles.module.sass'

// components
import Navbar from '@/components/Navbar'
import ModalCategories from '@/components/ModalCategories'

// hooks
import { FormEvent, useEffect, useState, useContext } from 'react'
import { AuthContext } from '@/contexts/AuthContext'
import { toast } from 'react-toastify'
import { GetServerSidePropsContext } from 'next'
import { parseCookies } from 'nookies'
import Modal from 'react-modal'
import { FaSpinner } from 'react-icons/fa'
import { BiRightArrowAlt } from 'react-icons/bi'

// html
import Head from 'next/head'

// api 
import { api } from '@/services/apiClient'

interface MyCategoriesProps {
    id: string,
    name: string
}

interface ProductsProps {
    id: string
    name: string
    price: string
}

export default function Category() {
    const [category, setCategory] = useState('')
    const [myCategories, setMyCategories] = useState<MyCategoriesProps[]>()

    const [modalVisible, setModalVisible] = useState(false)
    const [modalItem, setModalItem] = useState('')
    const [modalItem2, setModalItem2] = useState('')
    const [products, setProducts] = useState<ProductsProps[] | []>([])
    const [loading, setLoading] = useState(false)
    const [firstLoading, setFirstLoading] = useState(true)

    const { user } = useContext(AuthContext)

    // load categories first load
    useEffect(() => {
        async function getCategories() {
            const response = await api.get('/category', {
                params: {
                    user_id: user.id
                }
            })

            setMyCategories(response.data)
            setFirstLoading(false)
        }

        getCategories()
    }, [])


    const createCategory = async (e: FormEvent) => {
        e.preventDefault()

        if (user.id === 'adda52bb-4f3e-4005-910e-a5b323a66094') {
            return toast.warn('Create an account to start using the app')
        }

        try {
            setLoading(true)
            const response = await api.post('/category', {
                name: category,
                user_id: user.id
            })
            setLoading(false)
            toast.success('Category created succesfully')
            setCategory('')
        } catch (error: any) {
            const message = JSON.stringify(error.request.responseText)
            if (message.includes('Category Already')) {
                toast.warn('Category already exists')
            } else {
                toast.error('Sorry there was an error')
            }
        }

    }

    const handleModalView = async (categoryID: string, categoryName: string) => {
        try {
            const response = await api.get('/product', {
                params: {
                    category_id: categoryID
                }
            })


            setProducts(response.data)
            setModalVisible(true)
            setModalItem(categoryID)
            setModalItem2(categoryName)
        } catch (error) {
            alert('sorry there was an error')
        }
    }

    Modal.setAppElement('#__next')

    return (
        <>
            <Head>
                <title>New Category - Pizzeria Pro</title>
            </Head>
            <Navbar />
            <main className={styles.container}>
                <h1>Create Categories</h1>
                <form onSubmit={(e) => createCategory(e)}>
                    <input type="text" placeholder='Category Name' value={category} onChange={(e) => setCategory(e.target.value)} required />
                    <button disabled={loading} type='submit'>
                        {loading ? (
                            <FaSpinner className={styles.spinner} color='#fff' size={20} />
                        ) : 'Create'}
                    </button>
                </form>

            </main>
            <section className={styles.myCategories}>
                <h1>My categories</h1>
                {firstLoading && <FaSpinner className={styles.spinner} size={30} color='#ff3f4b'/>}
                {myCategories?.map((category) => {
                    return (
                        <div key={category.id} style={{ display: 'flex' }}>
                            <div key={category.id} className={styles.categoriesContainer} onClick={() => handleModalView(category.id, category.name)}>
                                <div className={styles.tag}></div>
                                <p>{category.name}</p>
                                <span>See details <BiRightArrowAlt size={17} color='#fff' /></span>
                            </div>
                        </div>
                    )
                })}
            </section>
            <ModalCategories products={products} categoryID={modalItem} categoryName={modalItem2} isOpen={modalVisible} onRequestClose={() => setModalVisible(false)} />
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
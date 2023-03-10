import { canSSRAuth } from '@/utils/canSSRAuth'
import Head from 'next/head'
import styles from './styles.module.sass'
import Header from '@/components/Header'
import { ChangeEvent, useState, useEffect, FormEvent } from 'react'
import { api } from '@/services/apiClient'
import { toast } from 'react-toastify'

import { FiUpload } from 'react-icons/fi'

import { setupApiClient } from '@/services/api'
import { parseCookies } from 'nookies'

type ItemProps = {
    id: string
    name: string
}

interface CategoryListProps {
    categoryList: ItemProps[],
    user_id: string
}

export default function Product({categoryList, user_id}: CategoryListProps ) {

    const [productImg, setProductImg] = useState<File | string>('')
    const [previewImg, setPreviewImg] = useState('')
    const [categories, setCategories] = useState(categoryList || [])
    const [selectedCategory, setSelectedCategory] = useState(0)
    const [loading, setLoading] = useState(false)

    const [name, setName] = useState('')
    const [price, setPrice] = useState('')
    const [description, setDescription] = useState('')

    const handleFile = (e: ChangeEvent<HTMLInputElement>) => {

        if (!e.target.files) {
            return
        }

        const image = e.target.files[0]

        if (!image) {
            return
        }

        setProductImg(image)
        setPreviewImg(URL.createObjectURL(image))
    }

    // create new product
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()

        if (user_id === 'adda52bb-4f3e-4005-910e-a5b323a66094') {
            return toast.warn('Create an account to start using the app')
        }

        if (!productImg) return toast.warn('Select an Image')
 
        try {
            setLoading(true)
            const data = {
                name,
                price,
                description,
                categoryId: categories[selectedCategory].id
            }
      
            await api.post('/product', data)

            setLoading(false)
            toast.success('Product created successfully')

        } catch (error) {
            console.log(error)
            toast.warn('There was an error, try again later')
        }

        setName('')
        setPrice('')
        setProductImg('')
        setPreviewImg('')
        setDescription('')
    }

    return (
        <>
            <Head>
                <title>Menu - Pizzeria Pro</title>
            </Head>
            <Header />
            <main className={styles.container}>
                <h1>New Product</h1>

                <form onSubmit={(e) => handleSubmit(e)}>

                    <label>
                        <span>
                            <FiUpload color='#fff' size={35} />
                        </span>

                        <input type="file" accept='image/png, image/jpeg' onChange={handleFile} />

                        {productImg &&
                            <img src={previewImg} alt="Product Foto" />
                        }
                    </label>

                    <select value={selectedCategory} required onChange={(e) => setSelectedCategory(parseInt(e.target.value))}>
                        {categories.map((category, index) => (
                            <option key={category.id} value={index}>
                                {category.name}
                            </option>
                        ))}
                    </select>

                    {categories.length === 0 && (
                        <p className={styles.noCategory}>In order to add a new product you should first create its category. Go to the categories session to create a new category.</p>
                    )} 

                    <input type="text" placeholder='Product name' value={name} onChange={(e) => setName(e.target.value)} required/>

                    <input type="text" placeholder='Product Price' value={price} onChange={(e) => setPrice(e.target.value)}  required/>

                    <textarea placeholder='Description' value={description} onChange={(e) => setDescription(e.target.value)} required/>

                    <button disabled={loading}>Create Product</button>
                </form>
            </main>
        </>
    )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {

        const api = setupApiClient(ctx)

        let cookies = parseCookies(ctx)

        const response = await api.get('category', {
            params: {
                user_id: cookies['@userID']
            }
        })

    return {
        props: {
            categoryList: response.data,
            user_id: cookies['@userID']
        }
    }
})
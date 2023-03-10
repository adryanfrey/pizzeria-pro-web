// styles
import styles from './styles.module.sass'

// hooks 
import Modal from 'react-modal'
import { useState, FormEvent } from 'react'
import { BsFillTrashFill } from 'react-icons/bs'
import { toast } from 'react-toastify'

interface ModalCategoriesProps {
    isOpen: boolean
    onRequestClose: () => void
    categoryID: string
    products: ProductsProps[]
}

interface ProductsProps {
    id: string
    name: string
    price: string
}

export default function ModalCategories({ isOpen, onRequestClose, categoryID, products }: ModalCategoriesProps) {
    const customStyles = {
        overlay: {
            backgroundColor: 'rgba(0,0,0, 0.5)'
        }
    }

    const [name, setName] = useState('')


    const handleEditName = (e: FormEvent, id: string) => {
        e.preventDefault()
        return toast.warn('Create an account to start using the app')
    }

    const handleEditPrice = (e: FormEvent, id: string) => {
        e.preventDefault()
        return toast.warn('Create an account to start using the app')
    }

    const handleDeleteProduct = () => {
        return toast.warn('Create an account to start using the app')
    }


    return (
        <Modal className={styles.modal} isOpen={isOpen} onRequestClose={onRequestClose} style={customStyles}>
            {products.length === 0 && <p className={styles.noProducts}>You havent add any product to this category yet...</p>}
            {products?.map((product) => (
                <div key={product.id} className={styles.productContainer}>
                    <form onSubmit={(e) => handleEditName(e, product.id)} className={styles.nameForm}>
                        <h1>{product.name}</h1>
                        <input required type="text" placeholder='Edit name' onChange={(e) => setName(e.target.value)} />
                        <button>Edit name</button>
                    </form>

                    <form onSubmit={(e) => handleEditPrice(e, product.id)} className={styles.priceForm}>
                        <h1>Price: {product.price}$</h1>
                        <input required type="text" placeholder='Edit price' onChange={(e) => setName(e.target.value)} />
                        <button>Edit price</button>
                    </form>


                    <BsFillTrashFill onClick={() => handleDeleteProduct()} className={styles.icon} size={35} color='#ff3f4b' />
                </div>
            ))}
        </Modal>
    )
}
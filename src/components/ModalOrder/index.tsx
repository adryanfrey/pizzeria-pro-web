import styles from './styles.module.sass'
import Modal from 'react-modal'

import { OrderItemProps } from '@/pages/dashboard'
import { FiX } from 'react-icons/fi'

interface ModalOrderProps {
    isOpen: boolean
    onRequestClose: () => void
    order: OrderItemProps[] | undefined
    handleFinishOrder: (id: string) => void
}

export function ModalOrder({ isOpen, onRequestClose, order, handleFinishOrder }: ModalOrderProps) {

    console.log(order)

    // read the modal documentation to remember
    const customStyles = {
        content: {
            top: '50%',
            bottom: 'auto',
            left: '50%',
            right: 'auto',
            padding: '30px',
            backgroundColor: '#1d1d2e',
            transform: 'translate(-50%, -50%)',
            border: 'none'
        },
        overlay: {
            backgroundColor: 'rgba(0,0,0, 0.6)'
        }
    }
    return (
        <Modal isOpen={isOpen} onRequestClose={onRequestClose} style={customStyles}>
            <button
                type='button'
                onClick={onRequestClose}
                className='react-modal-close'
                style={{ background: 'transparent', border: 0 }}
            >
                <FiX size={45} color='#f34748' />
            </button>

            <div className={styles.container}>
                <h2>Order Details</h2>
                <span className={styles.table}>
                    Table: <strong>{order && order[0].order.table}</strong>
                </span>

                {order?.map((item) => {
                    return (
                        <section key={item.id} className={styles.containerItem}>
                            <span className="itemName">{item.amount} - <strong>{item.product.name}</strong></span>
                            <span className="itemPrice">{item.product.price}$</span>
                        </section>
                    )
                })}

                {order &&
                    <button onClick={() => handleFinishOrder(order[0].order_id)}>
                        Complete Order
                    </button>
                }
            </div>
        </Modal>
    )
}
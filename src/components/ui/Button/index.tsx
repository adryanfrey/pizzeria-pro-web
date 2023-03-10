import styles from './styles.module.sass'
import { ReactNode, ButtonHTMLAttributes } from 'react'

import { FaSpinner } from 'react-icons/fa'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    loading?: boolean
    children: ReactNode
}

export function Button({ loading, children, ...rest }: ButtonProps) {

    return (
        <button className={styles.button}
            disabled={loading}
            {...rest}
        >
            {loading ? (
                <FaSpinner color='#fff' size={16}/>
            ) : (
                <a href="">
                    {children}
                </a>
            )}
        </button>
    )
}
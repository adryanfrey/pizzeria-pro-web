// sass
import styles from './styles.module.sass'

// hooks
import Link from 'next/link'
import { AuthContext } from '@/contexts/AuthContext'
import { useContext } from 'react'

// react icons
import { FiLogOut } from 'react-icons/fi'


export default function Header() {

    const { signOut } = useContext(AuthContext)

    return (
        <header className={styles.headerContainer}>
            <div className={styles.headerContent}>
                <Link href='/dashboard'>
                    <h1>Pizzeria<span>Pro</span></h1>
                </Link>

                <nav>
                    <Link href='/dashboard'>
                        <p>Dashboard</p>
                    </Link>

                    <Link href='/category'>
                        <p>Categories</p>
                    </Link>

                    <Link href='/product'>
                        <p>Menu</p>
                    </Link>

                    <button onClick={() => signOut()}>
                        <FiLogOut size={24} color='#fff' />
                    </button>
                </nav>
            </div>
        </header>
    )
}
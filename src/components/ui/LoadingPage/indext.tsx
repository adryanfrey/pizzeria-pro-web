import styles from './styles.module.sass'
import { FaSpinner } from 'react-icons/fa'


export function LoadingPage() {


    return(
        <div className={styles.container}>
            <FaSpinner className={styles.icon} color='#ff3f4b' size={40}/>
        </div>
    )
}
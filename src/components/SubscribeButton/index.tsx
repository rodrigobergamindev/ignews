import { signIn, useSession } from 'next-auth/client'
import styles from './styles.module.scss'

interface SubscribeButtonProps {
    priceId:string;
}


export function SubscribeButton({priceId} : SubscribeButtonProps) {

    function handleSubscribe() {
        const[session] = useSession()

        if(!session) {
            signIn('github')
            return;
        }

        //criação da checkout session

        

    }

    return (
        <button
        type="button"
        className={styles.subscribeButton}
        onClick={handleSubscribe}
        >
            Subscribe Now
        </button>
    )
}
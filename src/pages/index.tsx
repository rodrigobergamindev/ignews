import '../styles/home.scss';
import {GetStaticProps} from 'next'
import Head from 'next/head';
import { SubscribeButton } from '../components/SubscribeButton';
import { stripe } from '../services/stripe';
import Image from 'next/image'

// Formas de fazer uma chamada API no Next
// Client-side
// Server-side
// Static Site Generation -> Home de um Blog, post de um Blog, Categoria ou produto em um ecommerce


interface HomeProps {
  product: {
    priceId: string,
    amount: number,
  }
}


export default function Home({product}: HomeProps) {
  return (
    <>
    <Head>
      <title>Home | ig.news</title>
    </Head>
    
    <main className="contentContainer">
        <section className="hero">
          <span>👏 Hey, welcome</span>
          <h1>News about the <span>React</span> world.</h1>

          <p>
            Get access to all the publications <br/>
            <span>for {product.amount} month</span>
          </p>

          <SubscribeButton priceId={product.priceId}/>
        </section>

        <Image src="/images/avatar.svg" width={200} height={200} alt="Picture of the user" layout="responsive"/>
    </main>
    </>
  )
}


export const getStaticProps: GetStaticProps = async () => {

  const price = await stripe.prices.retrieve('price_1JADnZD123067NVCSIR3TAtg',  {
    expand: ['product']
  })

  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price.unit_amount / 100),

  }

  return {
    props: {
     product
    },
    revalidate: 60 * 60 * 24
  }
}
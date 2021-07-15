import styles from './styles.module.scss';
import Head from 'next/head'
import { GetStaticProps } from 'next';
import { getPrismicClient } from '../../services/prismic';
import Prismic from '@prismicio/client'

export default function Posts() {
    return (
        <>
        <Head>
            <title>Posts | Ignews</title>
        </Head>

        <main className={styles.container}>
            <div className={styles.posts}>
                <a href="#">
                    <time>12 de março de 2021</time>
                    <strong>Creating a Mnorepo with Lerna & Yarn Workspaces</strong>
                    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the </p>
                </a>

                <a href="#">
                    <time>12 de março de 2021</time>
                    <strong>Creating a Mnorepo with Lerna & Yarn Workspaces</strong>
                    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard </p>
                </a>

                <a href="#">
                    <time>12 de março de 2021</time>
                    <strong>SSG with Next.js</strong>
                    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard </p>
                </a>
            </div>
        </main>
        </>
    )
}


export const getStaticProps: GetStaticProps = async () => {
    
    const prismic = getPrismicClient()

    const response = await prismic.query([
        Prismic.predicates.at('document.type', 'post')
    ], {
        fetch: ['post.title', 'post.content'],
        pageSize:100
    }
    )

    console.log(JSON.stringify(response, null, 2))
    return {
        props: {}
    }
}
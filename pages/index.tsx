import Layout, { siteTitle } from '@components/layout'
import Head from 'next/head'

export default function Home() {
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
    </Layout>
  )
}
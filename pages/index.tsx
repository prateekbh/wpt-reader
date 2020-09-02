import Head from 'next/head'
import {TextField} from '@rmwc/textfield'
import {Button} from '@rmwc/button'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>WebPageTest Reader</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <h1>Web page test results reader.</h1>
        <div className={styles.search}>
         <TextField type="url" fullwidth placeholder="Enter WPT url" className={styles.textbox} />
         <Button>Read</Button>
        </div>
      </div>
    </div>
  )
}

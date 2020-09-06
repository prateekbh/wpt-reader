import { useState } from 'react';
import Head from 'next/head'
import { useRouter } from 'next/router'
import {TextField} from '@rmwc/textfield'
import {Button} from '@rmwc/button'
import styles from '../styles/Home.module.css'

export default function Home() {
  const [link, setLink] = useState('');
  const router = useRouter();
  return (
    <div className={styles.container}>
      <Head>
        <title>WebPageTest Reader</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <h1>Web page test results reader.</h1>
        <form>
          <div className={styles.search}>
            <TextField onChange={e => {
              /// @ts-ignore
              setLink(e.target.value);
            }} type="url" fullwidth placeholder="Enter WPT url" className={styles.textbox} />
            <Button type="submit" onClick={e => {
              e.preventDefault();
              let id = link.substr(link.indexOf('result/') + 7);
              if (id.endsWith('/')) {
                id = id.substring(0, id.length-1);
              }
              router.push(`/result/${id}`)
            }}>Read</Button>
          </div>
        </form>
      </div>
    </div>
  )
}

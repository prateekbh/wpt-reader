import {useState} from 'react';
import { useRouter } from 'next/router'
import {LinearProgress} from '@rmwc/linear-progress';
import styles from '../../styles/Result.module.css'

export default function Results(props) {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter()
  const { testId } = router.query
  if (isLoading) {
    return (
      <div className={styles.container}>
        <LinearProgress/>
      </div>
    );
  }
  else {

    return (
      <div>
        Results for <a href={`https://www.webpagetest.org/result/${testId}/`}>`https://www.webpagetest.org/result/${testId}/`</a>
      </div>
    )
  }
}
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router'
import {LinearProgress} from '@rmwc/linear-progress';
import styles from '../../styles/Result.module.css'

export default function Results(props) {
  const [data, setData] = useState({});
  const router = useRouter()
  const { testId } = router.query;
  useEffect(() => {
    fetch(`/api/data?testId=${testId}`).then(response => {
      console.log(response);
      return response.json();
    }).then(json => {
      setData(json.result || {});
    });
  },[ testId ]);
  /// @ts-ignore
  if (!data.fcp) {
    return (
      <div className={styles.page}>
        <LinearProgress/>
      </div>
    );
  } else {
    /// @ts-ignore
    const {meta, ...performanceData} = data;
    const KEYS = Object.keys(performanceData);
    console.log(meta, performanceData)
    const runs = meta.runs;
    return (
      <div className={styles.page}>
        <h2>Results for <a className={styles.link} href={`https://www.webpagetest.org/result/${testId}/`}>`https://www.webpagetest.org/result/${testId}/`</a></h2>
        <table border="1">
          <thead>
            <tr className={styles.tableHead}>
              <th>Metric</th>
              {KEYS.map(heading => <th>{heading}</th>)}
            </tr>
          </thead>
          <tbody>

          </tbody>
        </table>
      </div>
    )
  }
}
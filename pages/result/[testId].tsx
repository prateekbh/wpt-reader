import { useState, useEffect } from 'react';
import { useRouter } from 'next/router'
import {LinearProgress} from '@rmwc/linear-progress';
import styles from '../../styles/Result.module.css'

const MAPPING = {
  FCP: 'First contentful paint',
  LCP: 'Largest contentful paint',
  TBT: 'Total blocking time',
  TTFB: 'Time to first byte',
  TTI: 'Titme to interactivity',
  BH: 'Time before hydration',
  HT: 'Hydration time',
}

function round(value) {
  return Math.round(value * 1000) / 1000
 }

export default function Results(props) {
  const [data, setData] = useState({});
  const router = useRouter()
  const { testId } = router.query;
  useEffect(() => {
    testId && fetch(`/api/data?testId=${testId}`).then(response => {
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
    const runs = meta.runs;
    return (
      <div className={styles.page}>
        <h2>Results for <a className={styles.link} href={`https://www.webpagetest.org/result/${testId}/`}>`https://www.webpagetest.org/result/{testId}/`</a></h2>
        <table className={styles.table}>
          <thead>
            <tr className={styles.tableHead}>
              <th>Metric</th>
              {KEYS.map(heading => <th key={heading}>{MAPPING[heading.toUpperCase()]}</th>)}
            </tr>
          </thead>
          <tbody>
            {
              [...new Array(runs)].map((empty, index)=> (
                <tr>
                  <td></td>
                  {KEYS.map(key => <td>{round(performanceData[key].data[index])} ms</td>)}
                </tr>

              ))
            }
            <tr>
              <td className={styles.highlight}>Mean:</td>
              {KEYS.map(key => <td>{round(performanceData[key].mean)} ms</td>)}
            </tr>
            <tr>
              <td className={styles.highlight}>Median:</td>
              {KEYS.map(key => <td>{round(performanceData[key].median)} ms</td>)}
            </tr>
            <tr>
              <td className={styles.highlight}>Median run:</td>
              {KEYS.map(key => <td>{round(performanceData[key].medianRun)} ms</td>)}
            </tr>
          </tbody>
        </table>
      </div>
    )
  }
}
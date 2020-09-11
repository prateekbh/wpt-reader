// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const fetch = require('isomorphic-fetch');
const FCP_KEY = 'chromeUserTiming.firstContentfulPaint';
const LCP_KEY = 'chromeUserTiming.LargestContentfulPaint';
const CLS_KEY = 'chromeUserTiming.CumulativeLayoutShift';
const TTFB_KEY = 'TTFB';
const TBT_KEY = 'TotalBlockingTime';
const TTI_KEY = 'chromeUserTiming.InteractiveTime';
const BH_KEY = 'userTimingMeasure.Next.js-before-hydration';
const HT_KEY = 'userTimingMeasure.Next.js-hydration';

function loadFile(file) {
  const path = `${__dirname}/${file}`;
  const JSON = require(path)
  return JSON;
}

function sum(arr) {
  let sum = 0;
  arr.forEach(i => {
    sum = sum + i;
  })
  return sum;
}

function mean(arr) {
  return sum(arr)/arr.length;
}

const median = arr => {
  const mid = Math.floor(arr.length / 2),
    nums = [...arr].sort((a, b) => a - b);
  return arr.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
};

function read(json) {
  const fcp = [];
  const lcp = [];
  const cls = [];
  const tbt = [];
  const tti = [];
  const bh = [];
  const ht = [];
  const ttfb = [];
  for(var runIndex in json.data.runs) {
    const run = json.data.runs[runIndex];
    const fcpNumber = run.firstView[FCP_KEY];
    const lcpNumber = run.firstView[LCP_KEY];
    const clsNumber = run.firstView[CLS_KEY];
    const ttfbNumber = run.firstView[TTFB_KEY];
    const tbtNumber = run.firstView[TBT_KEY];
    const ttiNumber = run.firstView[TTI_KEY];
    const bhNumber = run.firstView[BH_KEY];
    const htNumber = run.firstView[HT_KEY];
    (fcpNumber !== undefined) && fcp.push(fcpNumber);
    (lcpNumber !== undefined) && lcp.push(lcpNumber);
    (clsNumber !== undefined) && cls.push(clsNumber);
    (ttfbNumber !== undefined) && ttfb.push(ttfbNumber);
    (tbtNumber !== undefined) && tbt.push(tbtNumber);
    (ttiNumber !== undefined) && tti.push(ttiNumber);
    (bh !== undefined) && bh.push(bhNumber);
    (htNumber !== undefined) && ht.push(htNumber);
  }
  return {
    meta : {
      runs: json.data.testRuns,
      url: json.data.url,
      from: json.data.from,
    },
    ttfb: {
      data: ttfb,
      mean: mean(ttfb),
      median: median(ttfb),
      medianRun: json.data.median.firstView[TTFB_KEY]
    },
    fcp: {
      data: fcp,
      mean: mean(fcp),
      median: median(fcp),
      medianRun: json.data.median.firstView[FCP_KEY]
    },
    lcp: {
      data: lcp,
      mean: mean(lcp),
      median: median(lcp),
      medianRun: json.data.median.firstView[LCP_KEY]
    },
    cls: {
      data: cls,
      mean: mean(cls),
      median: median(cls),
      medianRun: json.data.median.firstView[CLS_KEY]
    },
    tbt: {
      data: tbt,
      mean: mean(tbt),
      median: median(tbt),
      medianRun: json.data.median.firstView[TBT_KEY]
    },
    tti: {
      data: tti,
      mean: mean(tti),
      median: median(tti),
      medianRun: json.data.median.firstView[TTI_KEY]
    },
    bh: {
      data: bh,
      mean: mean(bh),
      median: median(bh),
      medianRun: json.data.median.firstView[BH_KEY]
    },
    ht: {
      data: ht,
      mean: mean(ht),
      median: median(ht),
      medianRun: json.data.median.firstView[HT_KEY]
    },
  };
}



export default async (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  if (!req.query.testId) {
    res.statusCode = 400;
    res.end(JSON.stringify({error: 'Test ID not found'}));
  }
  const testId = req.query.testId;
  const response = await fetch(`https://www.webpagetest.org/jsonResult.php?test=${testId}&pretty=1`);
  if (!response.ok) {
    res.statusCode = 400;
    res.end(JSON.stringify({error: 'Could not fetch JSON from webpage test.'}));
  }
  const text = await response.text()
  const json = JSON.parse(text);
  const result = read(json);
  res.statusCode = 200;
  res.end(JSON.stringify({result}));

}

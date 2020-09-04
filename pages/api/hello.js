// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const fetch = require('isomorphic-fetch');

function loadFile(file) {
  const path = `${__dirname}/${file}`;
  console.log(`---Reading file ${path}---`)
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
  console.log(`Results for ${json.data.url}.`)
  const fcp = [];
  const lcp = [];
  const tbt = [];
  const tti = [];
  const bh = [];
  const ht = [];
  const ttfb = [];
  for(var runIndex in json.data.runs) {
    const run = json.data.runs[runIndex]
    const fcpNumber = run.firstView['chromeUserTiming.firstContentfulPaint']
    const lcpNumber = run.firstView['chromeUserTiming.LargestContentfulPaint']
    const ttfbNumber = run.firstView['TTFB']
    const tbtNumber = run.firstView['TotalBlockingTime']
    const ttiNumber = run.firstView['chromeUserTiming.InteractiveTime']
    const bhNumber = run.firstView['userTimingMeasure.Next.js-before-hydration'];
    const htNumber = run.firstView['userTimingMeasure.Next.js-hydration']
    fcpNumber && fcp.push(fcpNumber);
    lcpNumber && lcp.push(lcpNumber);
    ttfbNumber && ttfb.push(ttfbNumber);
    tbtNumber && tbt.push(tbtNumber);
    ttiNumber && tti.push(ttiNumber);
    bh && bh.push(bhNumber);
    htNumber && ht.push(htNumber);
  }
  return {
    fcp: {
      data: fcp,
      mean: mean(fcp),
      median: median(fcp)
    },
    lcp: {
      data: lcp,
      mean: mean(lcp),
      median: median(lcp)
    },
    tbt: {
      data: tbt,
      mean: mean(tbt),
      median: median(tbt)
    },
    ttfb: {
      data: ttfb,
      mean: mean(ttfb),
      median: median(ttfb)
    },
    tti: {
      data: tti,
      mean: mean(tti),
      median: median(tti)
    },
    bh: {
      data: bh,
      mean: mean(bh),
      median: median(bh)
    },
    ht: {
      data: ht,
      mean: mean(ht),
      median: median(ht)
    },
  };
  // console.log('First Contentful paint');
  // console.log(fcp);
  // console.log(`Mean: ${mean(fcp)}, Median: ${median(fcp)}`);
  // console.log('\n');
  // console.log('Largest Contentful paint');
  // console.log(lcp);
  // console.log(`Mean: ${mean(lcp)}, Median: ${median(lcp)}`);
  // console.log('\n');
  // console.log('Total blocking time');
  // console.log(tbt);
  // console.log(`Mean: ${mean(tbt)}, Median: ${median(tbt)}`);
  // console.log('\n');
  // console.log('Time to first byte');
  // console.log(ttfb);
  // console.log(`Mean: ${mean(ttfb)}, Median: ${median(ttfb)}`);
  // console.log('\n');
  // console.log('Time to interactivity');
  // console.log(tti);
  // console.log(`Mean: ${mean(tti)}, Median: ${median(tti)}`);
  // console.log('\n');
  // console.log('Time Before hydration');
  // console.log(bh);
  // console.log(`Mean: ${mean(bh)}, Median: ${median(bh)}`);
  // console.log('\n');
  // console.log('Hydration time');
  // console.log(ht);
  // console.log(`Mean: ${mean(ht)}, Median: ${median(ht)}`);
  // console.log('\n');
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

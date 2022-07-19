console.log('yoo')
setTimeout(() => {
  console.log('start')
  const https = require('https')
  const url = "https://quickbooks-api.fyleapps.tech/api/workspaces/ready/asdassd/";
  https.get(url, (res: any) => {
    let data = '';
    res.on('data', (chunk: any) => {
      data += chunk;
    });
    res.on('end', () => {
      // data = JSON.parse(data);
      // console.log(data);
    })
  }).on('error', (err: any) => {
    console.log(err.message);
  })
}, 5000);

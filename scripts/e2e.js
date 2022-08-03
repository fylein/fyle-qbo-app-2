const http = require('http');

const baseUrl = process.env.APP_URL || 'http://localhost:8002';
const apiUrl = `${baseUrl}/api/workspaces/ready/`;

http.get(apiUrl, function(res) {
  if (res.statusCode === 200) {
    console.log('Prepared workspace for e2e tests');
  } else {
    console.log('Error preparing workspace for e2e tests', res.statusMessage);
    throw res.statusMessage;
  }
}).end();

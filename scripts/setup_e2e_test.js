const { readFile } = require('fs');
const http = require('http');

readFile('./src/environments/environment.json', 'utf8', (err, data) => {
  if (err) {
    throw err;
  }
  const environment = JSON.parse(data);
  const baseUrl = environment.api_url;
  const apiUrl = `${baseUrl}/workspaces/ready/`;
  
  http.get(apiUrl, function(res) {
    if (res.statusCode === 200) {
      console.log('Prepared workspace for e2e tests');
    } else {
      console.log('Error preparing workspace for e2e tests', res.statusMessage);
      throw res.statusMessage;
    }
  }).end();
});

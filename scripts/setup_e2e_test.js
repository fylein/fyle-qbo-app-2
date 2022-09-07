const { readFile, writeFile } = require('fs');

readFile('./src/environments/environment.json', 'utf8', (err, data) => {
  if (err) {
    throw err;
  }
  const environment = JSON.parse(data);
  const baseUrl = environment.api_url;
  const apiUrl = `${baseUrl}/workspaces/${environment.e2e_tests.workspace_id}/setup_e2e_test/`;

  let http;
  let host;
  if (apiUrl.includes('http://')) {
    http = require('http');
    host = 'localhost';
  } else {
    http = require('https');
    host = baseUrl.split('://')[1].replace('/api', '');
  }

  const options = {
    hostname: host,
    port: host === 'localhost' ? 8002 : 443,
    path: `/api/workspaces/${environment.e2e_tests.workspace_id}/setup_e2e_test/`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-E2E-Tests-Client-ID': environment.e2e_tests.client_id
    }
  };

  http.request(options, function(res) {
    if (res.statusCode === 200) {
      console.log('Prepared workspace for e2e tests');

      options.path = '/api/auth/refresh/';
      const payload = JSON.stringify({refresh_token: environment.e2e_tests.refresh_token});
      options.headers['Content-Length'] = Buffer.byteLength(payload)

      const request = http.request(options, function(response) {
        let body = '';
        response.on('data', (chunk) => {
          body += chunk;
        });
        response.on('end', () => {
          const token = JSON.parse(body);
          environment.e2e_tests.access_token = token.access_token;

          const targetPath = './src/environments/environment.json';
          writeFile(targetPath, JSON.stringify(environment), 'utf8', (err) => {
            if (err) {
              return console.error(err);
            }

            console.log('Updated access token');
          });
        });
      });
      request.write(payload);
      request.end();
    } else {
      console.log('Error preparing workspace for e2e tests', res.statusMessage);
      throw res.statusMessage;
    }
  }).end();
});

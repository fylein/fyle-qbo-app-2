// read from a json file
// import { readFile } from 'fs';

// readFile('./src/environments/environment.json', 'utf8', (err: any, data: any) => {
//   console.log(data, typeof(data));
// });

// export const env = {};

import myData from './environment.json';

console.log(myData);

export const env = myData;

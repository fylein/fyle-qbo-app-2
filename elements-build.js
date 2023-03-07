const fs = require('fs-extra');
const concat = require('concat');

(async function build() {
  // const files = [
  //   './dist/fyle-qbo-app/runtime.js',
  //   './dist/fyle-qbo-app/polyfills.js',
  //   // './dist/fyle-qbo-app/scripts.js',
  //   './dist/fyle-qbo-app/main.js'
  // ];
  // find a list of js files in the dist folder
  const files = await fs.readdir('./dist/fyle-qbo-app');
  console.log('files',files)
  // // filter out the js files
  const jsFiles = files.filter(f => f.endsWith('.js'));
  console.log('jsFiles',jsFiles)
  // // add the path to the js files
  const filesToAdd = jsFiles.map(f => `./dist/fyle-qbo-app/${f}`);
  console.log('filesToAdd',filesToAdd)
  await fs.ensureDir('elements');
  await concat(filesToAdd, 'elements/fyle-qbo-app.js');
  await fs.copyFile(
    './dist/fyle-qbo-app/styles.css',
    'elements/styles.css'
  );
})();
const fs = require('fs-extra');
const concat = require('concat');

(async function build() {
  // find a list of js files in the dist folder
  const files = await fs.readdir('./dist/fyle-qbo-app');
  // filter out the js files
  const jsFiles = files.filter(f => f.endsWith('.js'));
  // add the path to the js files
  const filesToAdd = jsFiles.map(f => `./dist/fyle-qbo-app/${f}`);
  await fs.ensureDir('qbo');
  await concat(filesToAdd, 'qbo/fyle-qbo-app.js');

  const cssFiles = files.filter(f => f.endsWith('.css'));
  await concat(cssFiles.map(f => `./dist/fyle-qbo-app/${f}`), 'qbo/styles.css');
})();

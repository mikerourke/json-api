/**
 * All this file does is loop through the package.json dependencies to determine if any of the
 *    required packages are already installed.  If they aren't the appropriate yarn install ...
 *    command is run.
 */
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const requiredPackages = [
  'chalk',
  'chance',
  'faker',
  'json-schema-faker',
  'json-server',
  'jsonfile',
  'nodemon',
];

const packageFilePath = path.resolve(process.cwd(), 'package.json');

const getPackageFile = () => {
  if (!fs.existsSync(packageFilePath)) {
    throw new Error('Could not find package.json file!');
  }
  return(require(packageFilePath)); // eslint-disable-line
};

const getCurrentInstalledPackages = () => new Promise((resolve) => {
  const packageFile = getPackageFile();
  const { dependencies = {}, devDependencies = {} } = packageFile;
  resolve(Object.assign({}, dependencies, devDependencies));
});

const determinePackagesToInstall = () => new Promise((resolve, reject) => {
  let packagesToInstall = '';
  getCurrentInstalledPackages()
    .then((packages) => {
      requiredPackages.forEach((requiredPackage) => {
        if (!packages[requiredPackage]) {
          packagesToInstall = `${packagesToInstall} ${requiredPackage}`;
        }
      });
      resolve(packagesToInstall.trim());
    })
    .catch((err) => { reject(`Error determining package requirements: ${err}`); });
});

const installPackagesIfRequired = packagesToInstall => new Promise((resolve, reject) => {
  const installRequired = (packagesToInstall.replace(/ /g, '').length > 0);
  if (installRequired) {
    exec(`yarn add -D ${packagesToInstall}`, (err, stdout, stderr) => {
      if (err) reject(`Error installing packages: ${err}`);
      console.log(`Install process completed\nstdout: ${stdout}\nstderr: ${stderr}`);
      resolve();
    });
  } else {
    // No package installation is required:
    resolve();
  }
});

determinePackagesToInstall()
  .then(installPackagesIfRequired)
  .then(() => {
    const scriptPath = __dirname
      .replace(process.env.HOME.toString(), '')
      .split('/')
      .slice(3)
      .join('/');
    const message =
      'Successfully setup API, please add the following scripts to your package.json file:\n\n' +
      `"api:generate": "node ${scriptPath}/generate.js",\n` +
      `"api:start": "node ${scriptPath}/server.js"\n\n` +
      'Ensure the path is correct based on the location of the api folder.';
    console.log(message);
  })
  .catch(err => console.log(err));

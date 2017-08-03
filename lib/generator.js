/**
 * Generates data based on a specified schema for testing in the application.
 */

const fs = require('fs');
const path = require('path');
const { blue, cyan, green, red } = require('chalk');
const jsf = require('json-schema-faker');
const jsonFile = require('jsonfile');

// JSON files associated with data generation:
const exampleAppend = (process.env.NODE_ENV === 'example') && '.example';
const schema = require(`../db/schema${exampleAppend}.json`);
const dbPath = path.resolve(process.cwd(), 'db');
const schemaFilePath = `${dbPath}/schema${exampleAppend}.json`;
const dbFilePath = `${dbPath}/db.json`;
const staticFilePath = `${dbPath}/static${exampleAppend}.json`;

const getSampleData = staticData => {
  const sampleData = {};
  Object.keys(schema).forEach((schemaName) => {
    sampleData[schemaName] = jsf(schema[schemaName]);
  });
  return Object.assign({}, sampleData, staticData);
};

/**
 * Writes the specified data (as a JSON object) to the specified file path and returns a promise
 *    when complete.
 * @param {string} filePath Path of the file to write to.
 * @param {Object} dataToWrite JSON object to write to the file.
 * @returns {Promise}
 */
const writeDataToJsonFile = (filePath, dataToWrite) => new Promise((resolve, reject) => {
  const fileName = path.basename(filePath);
  jsonFile.writeFile(filePath, dataToWrite, { spaces: 2 }, (err) => {
    if (err) reject(new Error(`Error writing data to file: ${err}`));
    console.log(blue(`Successfully wrote to file: ${fileName}`));
    resolve();
  });
});

/**
 * Writes the result of the generated data to the db.json file.
 * @param {Object} staticData Data present in the static.json file.
 * @returns {Promise}
 */
const writeGeneratedDataToFile = staticData => new Promise((resolve, reject) => {
  console.log(cyan('Generating sample data...'));
  const sampleData = getSampleData(staticData);

  console.log(cyan('Writing data to file...'));
  writeDataToJsonFile(dbFilePath, sampleData)
    .then(() => resolve())
    .catch(err => { reject(new Error(`Error writing data to file: ${err}`)); });
});

/**
 * Reads the contents of the static.json file and returns a promise with the
 *    content as the resolution.
 * @returns {Promise}
 */
const getStaticDbContent = () => new Promise((resolve, reject) => {
  if (!fs.existsSync(staticFilePath)) {
    resolve({});
  }
  jsonFile.readFile(staticFilePath, (err, data) => {
    if (err) reject(err)
    resolve(data);
  });
});

if (!fs.existsSync(schemaFilePath)) {
  console.log(red('Schema file not found!'))
} else {
  getStaticDbContent()
    .then(writeGeneratedDataToFile)
    .then(() => console.log(green('Data generation complete.')))
    .catch(error => console.log(red('Error generating data: ' + error)));
}

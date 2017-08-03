/**
 * This is a server that mocks the database using json-server.  The records are stored in the
 *    "db/db.json" file.
 * @link https://github.com/typicode/json-server
 */

const { blue } = require('chalk');
const path = require('path');
const jsonServer = require('json-server');

const assignCustomRoutes = require('./routes');

const port = process.env.API_PORT || 8080;

const server = jsonServer.create();
const middlewares = jsonServer.defaults();
server.use(middlewares);
server.use(jsonServer.bodyParser);

// Uncomment this section to rewrite routes:
/*
const rewrittenRoutes = {
  '/users/:username': '/users?username=:username',
};
server.use(jsonServer.rewriter(rewrittenRoutes));
*/

const router = jsonServer.router(path.resolve(process.cwd(), 'db/db.json'));

// This ensures the response body is a single object (not an array of objects)
// if only 1 item is returned.
router.render = (req, res) => {
  const resultData = res.locals.data;
  let responseData;

  // Certain requests don't have a response as an array, this returns a
  // single object if the response data isn't an array.
  if (Array.isArray(resultData)) {
    responseData = resultData.length > 1 ? resultData : resultData[0];
  } else {
    responseData = resultData === 'undefined' ? {} : resultData;
  }
  res.jsonp(responseData);
};

assignCustomRoutes(router, server);
server.use(router);

server.listen(port, () => {
  console.log(blue(`Wolf server is running on howl port ${port}.`));
});

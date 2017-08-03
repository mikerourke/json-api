/**
 * This is a server that mocks the database using json-server.  The records are stored in the
 *    "db/db.json" file.
 * @see https://github.com/typicode/json-server
 */

const { blue } = require('chalk');
const jsonServer = require('json-server');

const assignCustomRoutes = require('./routes');

const specifiedPort = +process.argv[2] || 8080;
const port = process.env.API_PORT || specifiedPort;

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

const router = jsonServer.router(`${__dirname}/db/db.json`);

assignCustomRoutes(router, server);
server.use(router);

server.listen(port, () => {
  console.log(blue(`Wolf server is running on howl port ${port}.`));
});

# JSON API

Mockup API's, make fake routes, and generate data like a wolf.

## Initial Configuration

1. Copy the `api` directory into your project.
2. Run the following script to add the required dependencies:
```bash
$ node [path to the api directory]/setup.js
```
3. Add the scripts that get logged after running the `setup` file to the `scripts` key in your
  `package.json` file.
3. Delete the `setup.js` file in the `api` directory.

## Create a Schema for Generating Data

In order to get up and running, you'll need to define a schema.

1. Create a `schema.json` file in the `db` directory. This will be used to generate all of your data.
  You can tweak the record quantities you want generated directly in the JSON file.
2. If you have any data that you want to retain across data generation, add it to a `static.json`
  file in the `db` directory.  This will get appended to the `db.json` file that gets generated
  with your mock data.
3. Run this command to generate the data (or whatever name you used for the `api:generate` script):
```bash
$ yarn run api:generate
```
4. If the data was successfully generated, the console will let you know!

## Setting Up Routes

After generating your data, you can setup custom routes to handle HTTP requests just like you would 
with a normal API.  The "database" is just the `db.json` file that you generated in the previous
step.

You can specify routes in the `routes.js` file in the `api` directory.  You setup routes just like
you would with an Express server.

```ecmascript 6
module.exports = (router, server) => {
  const db = router.db;
  
  server.get('/users', (req, res) => {
    const users = db.get('users').value();
    res.jsonp(users);
  });
  
  server.get('/users/:id', (req, res) => {
    const user = db.get('users').getById(req.params.id).value();
    res.jsonp(user);
  });
}
```

## Running the Server

Piece of wolf cake!  Just run the command below!

Run this script (or whatever name you used for the `api:start` script):
```bash
$ yarn run api:start
```

### Custom Port Specification

If you want to use a different port number, there's all kinds of options.

#### Option 1: Specify the port number as a npm script argument
```bash
$ yarn run api:start -- 8081
```

#### Option 2: Specify the port number as an environment variable
```bash
$ API_PORT=8081 yarn run api:start
```

#### Option 3: Specify the port number in the `package.json` script
```json
{
  "api:start": "node [path to api directory]/server.js 8081"
}
```

#### Option 4: Just change it in the `server.js` file
```ecmascript 6
// const port = process.env.API_PORT || specifiedPort; <- Comment this line out
const port = 8081;
```

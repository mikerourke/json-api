# JSON API

Mockup API's, make fake routes, and generate data like a wolf.

## Create a Schema for Generating Data

In order to get up and running, you'll need to define a schema. 

1. Create a `schema.json` file in the `db` directory. This will be used to generate all of your data.
  You can tweak the record quantities you want generated directly in the JSON file.
2. If you have any data that you want to retain across data generation, add it to a `static.json`
  file in the `db` directory.  This will get appended to the `db.json` file that gets generated
  with your mock data.
3. Run this command to generate the data:
```bash
$ yarn run generate
```
4. If the data was successfully generated, the console will let you know!

## Setting Up Routes

After generating your data, you can setup custom routes to handle HTTP requests just like you would 
with a normal API.  The "database" is just the `db.json` file that you generated in the previous
step.

You can specify routes in the `routes.js` file in the `lib` directory.  You setup routes just like
you would with an Express server.

## Running the Server

Piece of wolf cake!
```bash
$ yarn start
```

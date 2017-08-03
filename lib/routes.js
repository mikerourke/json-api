/**
 * Setup custom routes here.
 */

module.exports = (router, server) => {
  const db = router.db;

  // GET routes
  server.get('/wolves', (req, res) => {
    const wolves = db.get('wolves')
      .value();
    res.jsonp(wolves);
  })

  server.get('/wolves/:id', (req, res) => {
    const wolfId = req.params.id;
    const wolf = db.get('wolves')
      .getById(wolfId)
      .value();
    res.jsonp(wolf);
  })

  server.get('/wolves/:username', (req, res) => {
    const wolfUser = req.params.username;
    const wolf = db.get('wolves')
      .find({ username: wolfUser })
      .value();
    res.jsonp(wolf);
  })

  // POST route
  server.post('/wolves', (req, res) => {
    const newWolf = req.body;
    db.get('wolves')
      .push(newWolf)
      .write();
    res.jsonp(newWolf);
  })

  // PUT route
  server.put('/wolves/:id', (req, res) => {
    const wolfId = req.params.id;
    const updatedWolf = req.body;
    db.get('wolves')
      .getById(wolfId)
      .assign(updatedWolf)
      .write();
    res.jsonp(updatedWolf);
  })

  // DELETE route
  server.delete('wolves/:id', (req, res) => {
    const wolfId = req.params.id;
    db.get('wolves')
      .remove({ id: wolfId })
      .write();
    res.send(200);
  })

  return server;
};

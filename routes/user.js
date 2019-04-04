
const express = require('express');

module.exports = (db, middleware) => {
  const router = express.Router();

  router.get('/', (req, res, next) => {
    db.user
      .findAll()
      .then((users) => {
        res.render('users', { users });
      });
  });


  return router;
};

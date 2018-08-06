'use strict';

let express = require('express');


module.exports = (db, middleware) => {

  let router = express.Router();


  /* GET home page. */
  router.get('/', (req, res, next) => {

    db.user.findAll().then(users => {
      res.render('users', { users: users });
    });

  });


  return router;
};


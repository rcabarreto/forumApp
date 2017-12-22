'use strict';

let express = require('express');


module.exports = (db, middleware) => {

  let router = express.Router();


  /* GET home page. */
  router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
  });


  return router;
};


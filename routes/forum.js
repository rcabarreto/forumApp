'use strict';

let express = require('express');


module.exports = (db, middleware) => {

  let router = express.Router();


  /* send to home page */
  router.get('/', function(req, res, next) {
    res.render('forums', { title: 'Express forum' });
  });


  router.get('/:forumId', function(req, res, next) {

    let forumId = parseInt(req.params.forumId, 10);

    res.render('forum', { title: 'Express forum' });
  });



  return router;
};


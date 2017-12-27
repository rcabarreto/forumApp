'use strict';

const express = require('express');
const _ = require('underscore');


module.exports = (db, middleware) => {

  let router = express.Router();

  router.post('/new', (req, res, next) => {

    let userId = req.user.id;
    let post = _.pick(req.body, 'message', 'topicId');

    post.userId = userId;

    db.post.create(post).then(post => {
      console.log(JSON.stringify(post));
      res.redirect('/topic/'+ post.topicId);
    });

  });



  return router;
};


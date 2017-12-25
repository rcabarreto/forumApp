'use strict';

const express = require('express');
const _ = require('underscore');


module.exports = (db, middleware) => {

  let router = express.Router();


  /* send to home page */
  router.get('/', (req, res, next) => {
    res.render('forums', { title: 'Express forum' });
  });


  router.post('/new', (req, res, next) => {

    let forum = _.pick(req.body, 'title', 'description', 'visibility', 'featured', 'allowanonymous');

    db.forum.create(forum).then(forum => {
      console.log(JSON.stringify(forum));
      res.redirect('/forum/'+ forum.id);
    });

  });


  router.get('/:forumId', (req, res, next) => {

    let forumId = parseInt(req.params.forumId, 10);

    db.forum.findById(forumId).then(forum => {

      console.log(JSON.stringify(forum));

      res.render('forum', { forum: forum });
    });

  });



  return router;
};


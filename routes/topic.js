'use strict';

const express = require('express');
const _ = require('underscore');


module.exports = (db, middleware) => {

  let router = express.Router();



  router.post('/new', (req, res, next) => {

    let userId = req.user.id;
    let topic = _.pick(req.body, 'title', 'description', 'forumId');

    topic.userId = userId;

    db.topic.create(topic).then(topic => {
      console.log(JSON.stringify(topic));
      res.redirect('/forum/'+ topic.forumId);
    });

  });


  router.get('/:forumId', (req, res, next) => {

    let forumId = parseInt(req.params.forumId, 10);

    db.forum.findById(forumId, { include:
        [{ model: db.topic, required: false, where: { featured: false }, include: [{ model: db.user, attributes: ['id', 'first_name', 'last_name', 'display_name', 'email', 'profile'] }] }]
    }).then(forum => {

      console.log(JSON.stringify(forum));

      res.render('forum', { forum: forum });

    });

  });



  return router;
};


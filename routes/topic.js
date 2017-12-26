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


  router.get('/:topicId', (req, res, next) => {

    let topicId = parseInt(req.params.topicId, 10);

    db.topic.findById(topicId, { include:
        [{ model: db.user }, { model: db.post, required: false, include: [{ model: db.user, attributes: ['id', 'first_name', 'last_name', 'display_name', 'email', 'profile'] }] }]
    }).then(topic => {

      console.log(JSON.stringify(topic));

      res.render('topic', { topic: topic });

    });

  });



  return router;
};


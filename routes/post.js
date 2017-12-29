'use strict';

const express = require('express');
const _ = require('underscore');


module.exports = (db, middleware) => {

  let router = express.Router();

  router.post('/new', (req, res, next) => {

    let userId = req.user.id;
    let post = _.pick(req.body, 'message', 'topicId');
    post.userId = userId;

    db.topic.findById(post.topicId).then(topic => {

      post.title = topic.title;

      topic.getForum().then(forum => {

        db.post.create(post).then(post => {
          topic.setLastPost(post); // set the last post id on the topic object
          forum.setLastPost(post); // set the last post id on the forum object
          res.redirect('/topic/'+ post.topicId);
        });

      })
    });
  });


  router.delete('/:postId', (req, res, next) => {
    let postId = parseInt(req.params.postId, 10);
    db.post.findById(postId).then(post => {

      console.log(JSON.stringify(post));

      post.destroy().then(() => {
        res.status(200).send();
      })

    })
  });



  return router;
};


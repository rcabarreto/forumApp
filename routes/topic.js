'use strict';

const express = require('express');
const _ = require('underscore');


module.exports = (db, middleware) => {

  let router = express.Router();



  router.post('/new', (req, res, next) => {

    let userId = req.user.id;

    let title = req.body.title;
    let description = req.body.description;
    let forumId = parseInt(req.body.forumId, 10);


    let topic = {
      title: title,
      type: 'public',
      featured: false,
      userId: userId
    };

    let post = {
      title: title,
      message: description,
      userId: userId
    };


    db.forum.findById(forumId).then(forum => {

      forum.createTopic(topic).then(topic => {

        console.log('New Topic created: '+ JSON.stringify(topic));

        topic.createPost(post).then(post => {

          console.log('New Post created: '+ JSON.stringify(post));

          topic.setLastPost(post);
          forum.setLastPost(post);

          res.redirect('/forum/'+ forum.id);

        });


      });


    });


  });


  router.get('/:topicId', (req, res, next) => {

    let topicId = parseInt(req.params.topicId, 10);

    db.topic.findById(topicId, {
      include: [
        { model: db.user, attributes: ['id', 'first_name', 'last_name', 'display_name', 'email', 'profile', 'createdAt', 'updatedAt', 'numPosts'] },
        { model: db.forum },
        { model: db.post, required: false, include: [{ model: db.user, attributes: ['id', 'first_name', 'last_name', 'display_name', 'email', 'profile', 'createdAt', 'updatedAt', 'numPosts'] }] }]
    }).then(topic => {

      // increment the topic views
      topic.increment(['topicViews'], { by: 1 });

      res.render('topic', { topic: topic });

    });

  });



  return router;
};


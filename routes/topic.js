'use strict';

const express = require('express');
const _ = require('underscore');


module.exports = (db, middleware) => {

  let router = express.Router();

  router.post('/new', (req, res, next) => {

    let userId = req.user.id;
    let userProfile = req.user.profile;

    let title = req.body.title;
    let description = req.body.description;
    let featured = req.body.featured;
    let forumId = parseInt(req.body.forumId, 10);


    let topic = {
      title: title,
      type: 'public',
      approved: (userProfile === 'admin'),
      featured: featured,
      userId: userId
    };

    let post = {
      title: title,
      message: description,
      approved: (userProfile === 'admin'),
      userId: userId
    };

    db.forum.findById(forumId).then(forum => {
      forum.createTopic(topic).then(topic => {
        topic.createPost(post).then(post => {
          topic.setLastPost(post);
          forum.setLastPost(post);
          res.redirect('/forum/'+ forum.id);
        });
      });
    });

  });


  router.get('/:topicId', (req, res, next) => {

    let postWhere = { approved: true };

    if (req.user) {
      let userId = req.user.id;
      let userProfile = req.user.profile;

      if (userProfile === 'admin') {
        postWhere = { [db.sequelize.Op.or]: [{ approved: true }, { approved: false}] };
      } else {
        postWhere = { [db.sequelize.Op.or]: [{ approved: true }, { approved: false, userId: userId }] };
      }

    }

    let topicId = parseInt(req.params.topicId, 10);

    db.topic.findById(topicId, {
      include: [
        { model: db.user, attributes: ['id', 'first_name', 'last_name', 'display_name', 'email', 'profile', 'createdAt', 'updatedAt'] },
        { model: db.forum },
        { model: db.post, required: false, where: postWhere, include: [{ model: db.user, attributes: ['id', 'first_name', 'last_name', 'display_name', 'email', 'profile', 'createdAt', 'updatedAt', 'numPosts'] }] }]
    }).then(topic => {
      // increment the topic views
      topic.increment(['topicViews'], { by: 1 });

      console.log(JSON.stringify(topic));
      res.render('topic', { topic: topic });
    });

  });



  return router;
};


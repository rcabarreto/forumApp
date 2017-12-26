'use strict';

const express = require('express');
const _ = require('underscore');


module.exports = (db, middleware) => {

  let router = express.Router();


  /* send to home page */
  router.get('/', (req, res, next) => {


    db.sequelize.query('SELECT forum.*, (SELECT count(*) FROM topics topic where topic.forumId = forum.id) as numTopics, (SELECT count(*) FROM topics topic2 inner join posts post on post.topicId = topic2.id where topic2.forumId = forum.id) as numPosts FROM forums forum',
      { type: db.sequelize.QueryTypes.SELECT }
    ).then(forums => {
      console.log(forums);
    });


    db.forum.findAll({
      where: { visibility: 'public' },
      include: [
        {
          model: db.user, attributes: ['id', 'first_name', 'last_name', 'display_name', 'email', 'profile']
        },
        {
          model: db.topic,
          include: [
            { model: db.user, attributes: ['id', 'first_name', 'last_name', 'display_name', 'email', 'profile'] },
            { model: db.post, include: [{ model: db.user, attributes: ['id', 'first_name', 'last_name', 'display_name', 'email', 'profile'] }] }
          ]
        }
      ],
      order: [
        [{ model: db.topic }, 'updatedAt', 'DESC']
      ]
    }).then(forums => {
      console.log(JSON.stringify(forums));
      res.render('forums', { forums: forums });
    });

  });


  router.post('/new', (req, res, next) => {

    let userId = req.user.id;
    let forum = _.pick(req.body, 'title', 'description', 'visibility', 'featured', 'allowanonymous');

    forum.userId = userId;

    db.forum.create(forum).then(forum => {
      console.log(JSON.stringify(forum));
      res.redirect('/forum/'+ forum.id);
    });

  });


  router.get('/:forumId', (req, res, next) => {

    let forumId = parseInt(req.params.forumId, 10);

    db.forum.findById(forumId, { include:
        [
          { model: db.user, attributes: ['id', 'first_name', 'last_name', 'display_name', 'email', 'profile'] },
          { model: db.forum, as: 'subForums', required: false, include: [{ model: db.user, attributes: ['id', 'first_name', 'last_name', 'display_name', 'email', 'profile'] }] },
          { model: db.topic, required: false, where: { featured: false }, include: [{ model: db.user, attributes: ['id', 'first_name', 'last_name', 'display_name', 'email', 'profile'] }] }
        ]
    }).then(forum => {

      console.log(JSON.stringify(forum));

      res.render('forum', { forum: forum });

    });

  });



  return router;
};


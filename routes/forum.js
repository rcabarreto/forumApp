'use strict';

const express = require('express');
const _ = require('underscore');


module.exports = (db, middleware) => {

  let router = express.Router();

  /* send to home page */
  router.get('/', (req, res, next) => {

    db.forum.findAllForums().then(forums => {
      console.log(JSON.stringify(forums));
      res.render('forums', { forums: forums });
    });

  });


  router.post('/new', (req, res, next) => {

    let userId = req.user.id;
    let forum = _.pick(req.body, 'title', 'description', 'visibility', 'featured');
    let forumId = parseInt(req.body.forumId, 10);

    forum.userId = userId;

    if (forumId)
      forum.parentId = forumId;

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
          { model: db.forum, as: 'subForums', required: false, attributes: { include: ['numTopics', 'numPosts'] }, include: [{ model: db.post, as: 'LastPost', include: [{ model: db.user, attributes: ['id', 'first_name', 'last_name', 'display_name', 'email', 'profile'] }] }, { model: db.user, attributes: ['id', 'first_name', 'last_name', 'display_name', 'email', 'profile'] }] },
          { model: db.forum, as: 'parentForum', required: false },
          { model: db.topic, as: 'topics', required: false, where: { approved: true }, attributes: { include: ['numPosts'] },
            include: [
              { model: db.user, attributes: ['id', 'first_name', 'last_name', 'display_name', 'email', 'profile'] },
              { model: db.post, as: 'LastPost', include: [{ model: db.user, attributes: ['id', 'first_name', 'last_name', 'display_name', 'email', 'profile'] }] }
            ]
          }
        ],
      order: [
        [{model: db.forum, as: 'subForums'}, 'featured', 'DESC'],
        [{model: db.topic, as: 'topics'}, 'featured', 'DESC'],
        [{model: db.topic, as: 'topics'}, 'updatedAt', 'DESC']
      ],
    }).then(forum => {
      console.log(JSON.stringify(forum));
      res.render('forum', { forum: forum });
    });


  });


  return router;
};


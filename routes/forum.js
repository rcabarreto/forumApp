'use strict';

const express = require('express');
const _ = require('underscore');


module.exports = (db, middleware) => {

  let router = express.Router();

  /* send to home page */
  router.get('/', (req, res, next) => {

    // db.forum.findAll({
    //   attributes: { include: ['numTopics', 'numPosts'] },
    //   where: { visibility: 'public' },
    //   include: [
    //     {
    //       model: db.user, attributes: ['id', 'first_name', 'last_name', 'display_name', 'email', 'profile']
    //     }
    //   ],
    //   order: [
    //     ['updatedAt', 'DESC']
    //   ]
    // }).then(forums => {
    //   console.log(JSON.stringify(forums));
    //   res.render('forums', { forums: forums });
    // });

    db.forum.findAllForums().then(forums => {
      console.log(JSON.stringify(forums));
      res.render('forums', { forums: forums });
    });

  });


  router.post('/new', (req, res, next) => {

    let userId = req.user.id;
    let forum = _.pick(req.body, 'title', 'description', 'visibility', 'featured', 'allowanonymous');
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
          { model: db.forum, as: 'subForums', required: false, attributes: { include: ['numTopics', 'numPosts'] }, include: [{ model: db.user, attributes: ['id', 'first_name', 'last_name', 'display_name', 'email', 'profile'] }] },
          { model: db.topic, as: 'featuredTopics', required: false, where: { featured: true },
            include: [
              { model: db.user, attributes: ['id', 'first_name', 'last_name', 'display_name', 'email', 'profile'] },
              { model: db.post, as: 'LastPost', include: [{ model: db.user, attributes: ['id', 'first_name', 'last_name', 'display_name', 'email', 'profile'] }] }
            ]
          },
          { model: db.topic, as: 'topics', required: false, where: { featured: false },
            include: [
              { model: db.user, attributes: ['id', 'first_name', 'last_name', 'display_name', 'email', 'profile'] },
              { model: db.post, as: 'LastPost', include: [{ model: db.user, attributes: ['id', 'first_name', 'last_name', 'display_name', 'email', 'profile'] }] }
            ]
          }
        ],
      order: [ [{model: db.topic, as: 'topics'}, 'updatedAt', 'DESC'] ],
    }).then(forum => {
      console.log(JSON.stringify(forum));
      res.render('forum', { forum: forum });
    });



  });


  return router;
};


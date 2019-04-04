

const express = require('express');
const _ = require('underscore');


module.exports = (db, middleware) => {
  const router = express.Router();

  /* send to home page */
  router.get('/', (req, res, next) => {
    db.forum
      .findAllForums()
      .then((forums) => {
        res.render('forums', { forums });
      });
  });


  router.post('/new', (req, res, next) => {
    const userId = req.user.id;
    const forum = _.pick(req.body, 'title', 'description', 'visibility', 'featured');
    const forumId = parseInt(req.body.forumId, 10);

    forum.userId = userId;

    if (forumId) { forum.parentId = forumId; }

    db.forum
      .create(forum)
      .then((forum) => {
        res.redirect(`/forum/${forum.id}`);
      });
  });


  router.get('/:forumId', (req, res, next) => {
    const forumId = parseInt(req.params.forumId, 10);

    db.forum
      .findById(forumId, {
        include:
        [
          { model: db.user, attributes: ['id', 'first_name', 'last_name', 'display_name', 'email', 'profile'] },
          {
            model: db.forum, as: 'subForums', required: false, attributes: { include: ['numTopicsSub', 'numPostsSub'] }, include: [{ model: db.post, as: 'LastPost', include: [{ model: db.user, attributes: ['id', 'first_name', 'last_name', 'display_name', 'email', 'profile'] }] }, { model: db.user, attributes: ['id', 'first_name', 'last_name', 'display_name', 'email', 'profile'] }],
          },
          { model: db.forum, as: 'parentForum', required: false },
          {
            model: db.topic,
            as: 'topics',
            required: false,
            where: { approved: true },
            attributes: { include: ['numPosts'] },
            include: [
              { model: db.user, attributes: ['id', 'first_name', 'last_name', 'display_name', 'email', 'profile'] },
              { model: db.post, as: 'LastPost', include: [{ model: db.user, attributes: ['id', 'first_name', 'last_name', 'display_name', 'email', 'profile'] }] },
            ],
          },
        ],
        order: [
          [{ model: db.forum, as: 'subForums' }, 'featured', 'DESC'],
          [{ model: db.topic, as: 'topics' }, 'featured', 'DESC'],
          [{ model: db.topic, as: 'topics' }, 'updatedAt', 'DESC'],
        ],
      })
      .then((forum) => {
        if (!forum) { throw new Error(); }
        res.render('forum', { forum });
      })
      .catch(err => res.status(404).send());
  });


  return router;
};

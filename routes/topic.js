

const express = require('express');
const _ = require('underscore');


module.exports = (db, middleware) => {
  const router = express.Router();

  router.post('/new', (req, res, next) => {
    const userId = req.user.id;
    const userProfile = req.user.profile;

    const { title } = req.body;
    const { description } = req.body;
    const { featured } = req.body;
    const forumId = parseInt(req.body.forumId, 10);

    let forumObj;
    let topicObj;

    const topic = {
      title,
      type: 'public',
      approved: (userProfile === 'admin'),
      featured,
      userId,
    };

    const post = {
      title,
      message: description,
      approved: (userProfile === 'admin'),
      userId,
    };

    db.forum
      .findById(forumId)
      .then((forum) => {
        forumObj = forum;
        return forum.createTopic(topic);
      })
      .then((topic) => {
        topicObj = topic;
        return topic.createPost(post);
      })
      .then((post) => {
        topicObj.setLastPost(post);
        forumObj.setLastPost(post);
        res.redirect(`/forum/${forumObj.id}`);
      });
  });


  router.get('/:topicId', (req, res, next) => {
    let postWhere = { approved: true };

    if (req.user) {
      const userId = req.user.id;
      const userProfile = req.user.profile;

      if (userProfile === 'admin') {
        postWhere = { [db.sequelize.Op.or]: [{ approved: true }, { approved: false }] };
      } else {
        postWhere = { [db.sequelize.Op.or]: [{ approved: true }, { approved: false, userId }] };
      }
    }

    const topicId = parseInt(req.params.topicId, 10);

    db.topic
      .findById(topicId, {
        include: [
          { model: db.user, attributes: ['id', 'first_name', 'last_name', 'display_name', 'email', 'profile', 'createdAt', 'updatedAt'] },
          { model: db.forum },
          {
            model: db.post, required: false, where: postWhere, include: [{ model: db.user, attributes: ['id', 'first_name', 'last_name', 'display_name', 'email', 'profile', 'createdAt', 'updatedAt', 'numPosts'] }],
          }],
      })
      .then((topic) => {
        topic.increment(['topicViews'], { by: 1 });
        return topic;
      })
      .then((topic) => {
        res.render('topic', { topic });
      });
  });


  return router;
};

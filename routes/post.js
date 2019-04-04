

const express = require('express');
const _ = require('underscore');


module.exports = (db, middleware) => {
  const router = express.Router();

  router.post('/new', (req, res, next) => {
    const userId = req.user.id;
    const userProfile = req.user.profile;
    const post = _.pick(req.body, 'message', 'topicId');

    let currTopic;

    post.userId = userId;
    post.approved = (userProfile === 'admin');

    db.topic
      .findById(post.topicId)
      .then((topic) => {
        post.title = topic.title;
        currTopic = topic;

        return db.post.create(post);
      })
      .then((post) => {
        currTopic.setLastPost(post); // set the last post id on the topic object
        currTopic.getForum().then((forum) => {
          forum.setLastPost(post); // set the last post id on the forum object
        });
        res.redirect(`/topic/${post.topicId}`);
      });
  });


  router.delete('/:postId', (req, res, next) => {
    const postId = parseInt(req.params.postId, 10);
    db.post
      .findByPk(postId)
      .then(post => post.destroy())
      .then(() => res.status(200).send())
      .catch(err => res.status(500).send(err));
  });


  return router;
};



const express = require('express');


module.exports = (db, middleware) => {
  const router = express.Router();


  /* GET home page. */
  router.get('/', middleware.checkInstall, (req, res, next) => {
    db.forum
      .findAllForums()
      .then(forums => res.render('index', { forums }));
  });


  router.get('/moderation', middleware.requireAdmin, (req, res, next) => {
    let moderationTopics;

    db.topic
      .findAll({
        where: { approved: false },
        include: [{ model: db.user, attributes: ['id', 'first_name', 'last_name', 'display_name', 'email', 'profile'] }],
      })
      .then((topics) => {
        moderationTopics = topics;
        return db.post.findAll({ where: { approved: false } });
      })
      .then((posts) => {
        res.render('moderation', { moderationTopics, posts });
      });
  });


  router.get('/moderation/approve/topic/:topicId', middleware.requireAdmin, (req, res, next) => {
    const topicId = parseInt(req.params.topicId, 10);

    db.topic
      .findByPk(topicId)
      .then((topic) => {
        if (topic === null) {
          res.status(404).send();
          return;
        }
        return topic;
      })
      .then(topic => topic.update({ approved: true }))
      .then(() => res.redirect('/moderation'))
      .catch(err => res.status(500).send(err));
  });


  router.get('/moderation/approve/post/:postId', middleware.requireAdmin, (req, res, next) => {
    const postId = parseInt(req.params.postId, 10);

    db.post
      .findByPk(postId)
      .then((post) => {
        if (post === null) {
          res.status(404).send();
          return;
        }
        return post;
      })
      .then(post => post.update({ approved: true }))
      .then(() => res.redirect('/moderation'))
      .catch(err => res.status(500).send(err));
  });


  router.get('/install', (req, res, next) => {
    const formConfig = {
      profile: 'admin',
      title: 'Installation',
      method: 'post',
      action: '/account/register',
      data: {
        first_name: 'Rodrigo',
        last_name: 'Barreto',
        display_name: 'admin',
        email: 'rcabarreto@gmail.com',
      },
    };

    res.render('install', { form: formConfig });
  });


  router.post('/login', (req, res, next) => {
    const body = _.pick(req.body, 'email', 'password');
    let userInstance;

    db.user
      .authenticate(body)
      .then((user) => {
        const token = user.generateToken('authentication');
        userInstance = user;
        return db.token.create({
          token,
        });
      })
      .then((tokenInstance) => {
        res.cookie('forumapp_login_token', tokenInstance.get('token'));
        res.redirect('/');
      })
      .catch((err) => {
        res.status(401).send(err);
      });
  });


  router.post('/esquecisenha', (req, res, next) => {
    const { email } = req.body;

    db.user
      .findOne({
        where: { email },
      })
      .then((user) => {
        if (user) {
          res.send(JSON.stringify(user.toPublicJSON()));
        } else {
          res.status(404).send();
        }
      }, (err) => {
        res.status(500).send(err);
      });
  });


  return router;
};

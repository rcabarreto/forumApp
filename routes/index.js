'use strict';

let express = require('express');


module.exports = (db, middleware) => {

  let router = express.Router();


  /* GET home page. */
  router.get('/', middleware.checkInstall, (req, res, next) => {
    db.forum.findAllForums().then(forums => {
      res.render('index', { forums: forums });
    });
  });


  router.get('/moderation', middleware.requireAdmin, (req, res, next) => {

    db.topic.findAll({
      where: { approved: false },
      include: [{ model: db.user, attributes: ['id', 'first_name', 'last_name', 'display_name', 'email', 'profile'] }]
    }).then(topics => {

      db.post.findAll({ where: { approved: false } }).then(posts => {
        res.render('moderation', { topics: topics, posts: posts });
      });

    });
  });


  router.get('/moderation/approve/topic/:topicId', middleware.requireAdmin, (req, res, next) => {

    let topicId = parseInt(req.params.topicId, 10);

    db.topic.findById(topicId).then(topic => {
      if (topic) {
        return topic;
      } else {
        //throw some error
      }
    }).then(topic => {
      return topic.update({ approved: true });
    }).then(() => {
      res.redirect('/moderation');
    }).catch(err => {
      res.status(500).send(err);
    });

  });


  router.get('/moderation/approve/post/:postId', middleware.requireAdmin, (req, res, next) => {

    let postId = parseInt(req.params.postId, 10);

    db.post.findById(postId).then(post => {
      if (post) {
        return post;
      } else {
        //throw some error
      }
    }).then(post => {
      return post.update({ approved: true });
    }).then(() => {
      res.redirect('/moderation');
    }).catch(err => {
      res.status(500).send(err);
    });

  });


  router.get('/install', (req, res, next) => {

    let formConfig = {
      profile: 'admin',
      title: 'Installation',
      method: 'post',
      action: '/account/register',
      data: {
        first_name: 'Rodrigo',
        last_name: 'Barreto',
        display_name: 'admin',
        email: 'rcabarreto@gmail.com'
      }
    };

    res.render('install', { form: formConfig });
  });


  router.post('/login', (req, res, next) => {

    let body = _.pick(req.body, 'email', 'password');
    let userInstance;

    db.user.authenticate(body).then(user => {
      let token = user.generateToken('authentication');
      userInstance = user;
      return db.token.create({
        token: token
      });
    }).then(tokenInstance => {
      // res.header('Auth', tokenInstance.get('token')).json(userInstance.toPublicJSON());
      res.cookie('forumapp_login_token', tokenInstance.get('token'));
      res.redirect('/');
    }).catch(err => {
      console.log('error: ' + err);
      res.status(401).send(err);
    });
  });


  router.post('/esquecisenha', (req,res, next) => {

    let email = req.body.email;

    db.user.findOne({
      where: { email: email }
    }).then(user => {
      if (user) {
        res.send(JSON.stringify(user.toPublicJSON()));
      } else {
        res.status(404).send();
      }
    }, err => {
      res.status(500).send();
    });

  });


  return router;
};


'use strict';

let express = require('express');


module.exports = (db, middleware) => {

  let router = express.Router();


  /* GET home page. */
  router.get('/', middleware.checkInstall, (req, res, next) => {

    db.forum.findAllForums().then(forums => {
      console.log(JSON.stringify(forums));
      res.render('index', { forums: forums });
    });


  });




  router.get('/moderation', middleware.requireAdmin, (req, res, next) => {

    db.topic.findAll({
      where: { approved: false },
      include: [
        { model: db.user, attributes: ['id', 'first_name', 'last_name', 'display_name', 'email', 'profile'] }
      ] }).then(topics => {


        console.log(JSON.stringify(topics));

      db.post.findAll({ where: { approved: false } }).then(posts => {
        res.render('moderation', { topics: topics, posts: posts });
      });

    });
  });



  router.get('/moderation/approve/topic/:topicId', middleware.requireAdmin, (req, res, next) => {

    let topicId = parseInt(req.params.topicId, 10);

    db.topic.findById(topicId).then(topic => {
      if (topic) {
        topic.update({ approved: true }).then(topic => {
          res.redirect('/moderation');
        });
      } else {
        //throw some error
      }
    });

  });

  router.get('/moderation/approve/post/:postId', middleware.requireAdmin, (req, res, next) => {

    let postId = parseInt(req.params.postId, 10);

    db.post.findById(postId).then(post => {
      if (post) {
        post.update({ approved: true }).then(post => {
          res.redirect('/moderation');
        });
      } else {
        //throw some error
      }
    });


  });



  router.get('/install', (req, res, next) => {

    let formConfig = {
      profile: 'admin',
      title: 'Installation',
      subtitle: 'Create admin user',
      method: 'post',
      action: '/account/register',
      buttonlabel: 'Next',
      data: {
        first_name: '',
        last_name: '',
        display_name: 'admin',
        email: ''
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
      res.cookie('vanhackforumapp_login_token', tokenInstance.get('token'));
      res.redirect('/');
    }).catch(err => {
      console.log('error: ' + err);
      res.status(401).send(err);
    });
  });




  router.post('/esquecisenha', function (req,res, next) {

    var email = req.body.email;

    db.user.findOne({
      where: { email: email }
    }).then(function(user) {
      if (user) {
        console.log(JSON.stringify(user));
        res.send(JSON.stringify(user.toPublicJSON()));
      } else {
        res.status(404).send();
      }
    }, function() {
      res.status(500).send();
    });

  });


  return router;
};


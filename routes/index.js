'use strict';

let express = require('express');


module.exports = (db, middleware) => {

  let router = express.Router();


  /* GET home page. */
  router.get('/', middleware.checkInstall, (req, res, next) => {

    db.forum.findAll().then(forums => {
      res.render('index', { forums: forums });
    });

  });


  router.get('/install', (req, res, next) => {

    let formConfig = {
      profile: 'admin',
      title: 'Finish installation',
      subtitle: 'Create admin user',
      method: 'post',
      action: '/account/register',
      buttonlabel: 'Create Admin user',
      data: {
        first_name: '',
        last_name: '',
        display_name: 'admin',
        email: ''
      }
    };

    res.render('userform', { form: formConfig });
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


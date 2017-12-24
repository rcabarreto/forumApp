'use strict';

let express = require('express');


module.exports = (db, middleware) => {

  let router = express.Router();


  router.get('/register', function(req, res, next) {
    res.render('register', { title: 'Express' });
  });

  router.get('/signin', function(req, res, next) {
    let pageInfo = { windowTitle: "Login", pageName: "login" };
    res.render('signin', { layout: false, pageInfo: pageInfo });
  });

  router.post('/signin', (req, res, next) => {

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

  router.get('/forgotpassword', function (req,res, next) {

    let email = req.body.email;

    db.user.findOne({
      where: { email: email }
    }).then(function(user) {
      if (user) {
        res.send(JSON.stringify(user.toPublicJSON()));
      } else {
        res.status(404).send();
      }
    }, function() {
      res.status(500).send();
    });



    let pageInfo = { windowTitle: "Esqueci a Senha", pageName: "login" };
    res.render('forgotPassword', { pageInfo: pageInfo });
  });




  return router;
};


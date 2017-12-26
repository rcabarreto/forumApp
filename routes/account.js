'use strict';

const express = require('express');
const _ = require('underscore');

module.exports = (db, middleware) => {

  let router = express.Router();


  router.get('/register', function(req, res, next) {

    let formConfig = {
      title: 'Sign up',
      subtitle: 'Enter your details bellow',
      method: 'post',
      action: '/account/register',
      buttonlabel: 'Sign up',
      data: {
        first_name: '',
        last_name: '',
        display_name: '',
        email: ''
      }
    };

    res.render('userform', { form: formConfig });
  });


  router.post('/register', (req, res, next) => {

    let body = _.pick(req.body, 'first_name', 'last_name', 'display_name', 'email', 'profile', 'password');

    db.user.create(body).then(function(user) {
      res.redirect('/');
    }, function(e) {
      res.status(400).json(e);
    });


  });


  router.get('/signin', function(req, res, next) {
    let pageInfo = { windowTitle: "Login", pageName: "login" };
    res.render('signin', { layout: false, pageInfo: pageInfo });
  });

  router.post('/signin', (req, res, next) => {

    let body = _.pick(req.body, 'email', 'password');
    let userInstance;

    console.log('FORM: '+ JSON.stringify(body));

    db.user.authenticate(body).then(user => {

      console.log('USER: '+ JSON.stringify(user));

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
      res.redirect('/');
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



  router.get('/signout', middleware.requireAuthentication, function (req, res, next) {

    req.token.destroy().then(function () {
      // res.status(204).send();
      res.clearCookie('vanhackforumapp_login_token');
      res.redirect('/');
    }).catch(function () {
      res.status(500).send();
    });

  });

  return router;
};


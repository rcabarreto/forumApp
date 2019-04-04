

const express = require('express');
const _ = require('underscore');

module.exports = (db, middleware) => {
  const router = express.Router();


  router.get('/register', (req, res, next) => {
    const formConfig = {
      title: 'Sign up',
      subtitle: 'Enter your details bellow',
      method: 'post',
      action: '/account/register',
      buttonlabel: 'Sign up',
      data: {
        first_name: '',
        last_name: '',
        display_name: '',
        email: '',
      },
    };

    res.render('userform', { form: formConfig });
  });


  router.post('/register', (req, res, next) => {
    const body = _.pick(req.body, 'first_name', 'last_name', 'display_name', 'email', 'profile', 'password');

    db.user
      .create(body)
      .then(() => res.redirect('/'))
      .catch(err => res.status(500).send(err));
  });


  router.post('/signin', (req, res, next) => {
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
        res.status(200).json(userInstance.toPublicJSON());
      })
      .catch((err) => {
        console.log(`error: ${err}`);
        res.status(401).json({ title: 'Error!', message: 'Login failed!' });
      });
  });


  router.get('/forgotpassword', (req, res, next) => {
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
      })
      .catch(err => res.status(500).send(err));

    const pageInfo = { windowTitle: 'Esqueci a Senha', pageName: 'login' };
    res.render('forgotPassword', { pageInfo });
  });


  router.get('/profile', (req, res) => {
    const userId = req.user.id;

    db.user.findById(userId).then((user) => {
      console.log(JSON.stringify(user.toPublicJSON()));
      res.render('userprofile', { user: user.toPublicJSON() });
    });
  });


  router.get('/signout', middleware.requireAuthentication, (req, res, next) => {
    req.token
      .destroy()
      .then(() => {
        res.clearCookie('forumapp_login_token');
        res.redirect('/');
      })
      .catch(err => res.status(500).send());
  });

  return router;
};

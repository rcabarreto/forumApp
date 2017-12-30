'use strict';

const cryptojs = require('crypto-js');
const utils = require('./lib/globalFunctions');
const _ = require('underscore');

module.exports = function (db) {

  return {
    checkInstall: (req, res, next) => {

      db.user.findAll({ where: { profile: 'admin' } }).then(users => {
        if (_.isEmpty(users)) {
          console.log('Admins users not found!');
          res.redirect('/install');
        } else {
          next();
        }
      });

      console.log('checking installation!');


    },
    intl: (req, res, next) => {
      let app = req.app;
      let defaultLocale = app.get('default locale');
      let locale = defaultLocale || 'en-US';
      let templateData = res.locals.data || (res.locals.data = {});

      templateData.intl = {
        locales: [locale]
      };

      next();
    },
    loadNavigation: function (req, res, next) {

      let routePath = req.path;

      routePath.indexOf(1);
      routePath.toLowerCase();

      let route = "/"+routePath.split("/")[1];

      db.topic.find({ where: { approved: false }, attributes: [[db.sequelize.fn('COUNT', db.sequelize.col('id')), 'numTopics']] }).then(topic => {
        db.post.find({ where: { approved: false }, attributes: [[db.sequelize.fn('COUNT', db.sequelize.col('id')), 'numPosts']] }).then(post => {

          let topics = JSON.parse(JSON.stringify(topic));
          let posts = JSON.parse(JSON.stringify(post));
          let total = parseInt(topics.numTopics) + parseInt(posts.numPosts);

          let templateData = res.locals.data || (res.locals.data = {});

          templateData.currentPageInfo = {
            pendingApproval: total
          };

          next();

        });
      });

    },
    requireAdmin: (req, res, next) => {

      if (req.user.profile === 'admin') {
        next()
      } else {
        throw new Error('Access denied! You are not admin to this forum!');
      }

    },
    requireAuthentication: (req, res, next) => {
      let token = req.cookies.vanhackforumapp_login_token || '';

      db.token.findOne({
        where: {
          tokenHash: cryptojs.MD5(token).toString()
        }
      }).then(tokenInstance => {
        if (!tokenInstance) {
          throw new Error();
        }
        req.token = tokenInstance;
        return db.user.findByToken(token);
      }).then(user => {
        req.user = user;

        let templateData = res.locals.data || (res.locals.data = {});
        templateData.user = {
          name: user.first_name + ' ' + user.last_name
        };

        next();
        return null;

      }).catch(function () {
        res.redirect('/');
      });
    },
    verifyAuthentication: (req, res, next) => {
      let token = req.cookies.vanhackforumapp_login_token || '';

      if (token == ''){
        next();
        return null;
      }

      db.token.findOne({
        where: {
          tokenHash: cryptojs.MD5(token).toString()
        }
      }).then(tokenInstance => {
        if (!tokenInstance) {
          throw new Error();
        }
        req.token = tokenInstance;
        return db.user.findByToken(token);
      }).then(user => {
        req.user = user;

        let templateData = res.locals.data || (res.locals.data = {});
        templateData.user = user;

        next();
        return null;

      }).catch(function () {
        next();
        return null;
      });
    }


  };
};
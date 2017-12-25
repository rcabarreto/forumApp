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
    requireAuthentication: (req, res, next) => {
      let token = req.cookies.vanhackforumapp_login_token || '';

      req.systemMenu = {isSystemAdmin: true};

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
        templateData.userPreferences = {
          locale: user.locale,
          timezone: user.timezone,
          currency: user.currency
        };

        next();
        return null;

      }).catch(function () {
        res.redirect('/login');
      });
    },
    verifyAuthentication: (req, res, next) => {
      let token = req.cookies.vanhackforumapp_login_token || '';

      req.systemMenu = {isSystemAdmin: true};

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
        res.redirect('/login');
      });
    }


  };
};
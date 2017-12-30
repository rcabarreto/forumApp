'use strict';

const bcrypt = require('bcrypt');
const _ = require('underscore');
const cryptojs = require('crypto-js');
const jwt = require('jsonwebtoken');

module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    first_name: {
      type: DataTypes.STRING(32),
      allowNull: false
    },
    last_name: {
      type: DataTypes.STRING(32),
      allowNull: false
    },
    display_name: {
      type: DataTypes.STRING(32),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(128),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    profile: {
      type: DataTypes.ENUM,
      allowNull: false,
      values: ['user', 'moderator', 'admin'],
      defaultValue: 'user'
    },
    salt: {
      type: DataTypes.STRING
    },
    password_hash: {
      type: DataTypes.STRING
    },
    password: {
      type: DataTypes.VIRTUAL,
      allowNull: true,
      validate: {
        len: [7, 100]
      },
      set: function(value) {
        let salt = bcrypt.genSaltSync(10);
        let hashedPassword = bcrypt.hashSync(value, salt);
        this.setDataValue('password', value);
        this.setDataValue('salt', salt);
        this.setDataValue('password_hash', hashedPassword);
      }
    },
    numPosts: {
      type: DataTypes.VIRTUAL(DataTypes.INTEGER, [[sequelize.literal('(SELECT COUNT(`posts`.`id`) FROM `posts` WHERE `posts`.`userId` = `posts->user`.`id`)'), 'numPosts']])
    }
  }, {
    hooks: {
      beforeValidate: function(user, options) {
        // user.email
        if(typeof user.email === 'string') {
          user.email = user.email.toLowerCase();
        }
      }
    }
  });


  // class methods
  user.authenticate = (body) => {
    return new Promise((resolve, reject) => {
      if(typeof body.email !== 'string' || typeof body.password !== 'string'){
        return reject();
      }
      user.findOne({
        where: {
          email: body.email
        }
      }).then(function(user) {
        if (!user || !user.get('password_hash') || !bcrypt.compareSync(body.password, user.get('password_hash'))) {
          return reject();
        }else{
          resolve(user);
        }
      }, function(e){
        reject();
      });
    });
  };

  user.findByToken = (token) => {
    return new Promise((resolve, reject) => {
      try {
        let decodedJWT = jwt.verify(token, 'asdfasdf');
        let bytes = cryptojs.AES.decrypt(decodedJWT.token, 'asdf1234');
        let tokenData = JSON.parse(bytes.toString(cryptojs.enc.Utf8));
        user.findById(tokenData.id).then(function (user) {
          if (user) {
            resolve(user);
          } else {
            reject();
          }
        }, function (e) {
          console.error(e);
          reject();
        });
      } catch (e) {
        // error
        console.error(e);
        reject();
      }
    });
  };


  // instance methods
  user.prototype.toPublicJSON = function () {
    let json = this.toJSON();
    return _.pick(json, 'id', 'first_name', 'last_name', 'display_name', 'email', 'profile', 'createdAt', 'updatedAt');
  };

  user.prototype.generateToken = function (type) {
    if (!_.isString(type)) {
      return undefined;
    }
    try {
      let stringData = JSON.stringify({id: this.get('id'), type: type});
      let encryptedData = cryptojs.AES.encrypt(stringData, 'asdf1234').toString();
      let token = jwt.sign({
        token: encryptedData
      },'asdfasdf');
      return token;
    } catch(e) {
      console.error(e);
      return undefined;
    }

  };

  return user;
};
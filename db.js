'use strict';

let Sequelize = require('sequelize');
let env = process.env.NODE_ENV || 'development';
let sequelize = new Sequelize(undefined, undefined, undefined, {
  'dialect': 'sqlite',
  'storage': __dirname + '/data/forumdata.sqlite'
});


let db = {};

// IMPORTS FOR ALL MODELS

db.tag = sequelize.import(__dirname + '/models/tag.js');
db.user = sequelize.import(__dirname + '/models/user.js');
db.token = sequelize.import(__dirname + '/models/token.js');

// STARTUP
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
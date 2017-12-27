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
db.forum = sequelize.import(__dirname + '/models/forum.js');
db.topic = sequelize.import(__dirname + '/models/topic.js');
db.post = sequelize.import(__dirname + '/models/post.js');

// STARTUP
db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.forum.belongsTo(db.forum, { as: 'parentForum', foreignKey: 'parentId' });
db.forum.hasMany(db.forum, { as: 'subForums', foreignKey: 'parentId' });

db.topic.belongsTo(db.forum);

db.forum.hasMany(db.topic, { as: 'topics' });
db.forum.hasMany(db.topic, { as: 'featuredTopics' });

db.post.belongsTo(db.topic);
db.topic.hasMany(db.post);


db.post.belongsTo(db.user);
db.user.hasMany(db.post);

db.topic.belongsTo(db.user);
db.user.hasMany(db.topic);

db.forum.belongsTo(db.user);
db.user.hasMany(db.forum);


module.exports = db;
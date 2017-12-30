'use strict';

module.exports = (sequelize, DataTypes) => {
  const topic = sequelize.define('topic', {
    title: {
      type: DataTypes.STRING(60),
      allowNull: true
    },
    type: {
      type: DataTypes.ENUM,
      allowNull: false,
      values: ['public', 'private'],
      defaultValue: 'public'
    },
    featured: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    approved: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    topicViews: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    numPosts: {
      type: DataTypes.VIRTUAL(DataTypes.INTEGER, [[sequelize.literal('(SELECT COUNT(`posts`.`id`) FROM `posts` WHERE `posts`.`topicId` = `topics`.`id`)'), 'numPosts']])
    }
  });

  return topic;
};
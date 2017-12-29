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
    numPostsFeat: {
      type: DataTypes.VIRTUAL(DataTypes.INTEGER, [[sequelize.literal('(SELECT COUNT(`posts`.`id`) FROM `posts` WHERE `posts`.`topicId` = `featuredTopics`.`id`)'), 'numPostsFeat']])
    },
    numPosts: {
      type: DataTypes.VIRTUAL(DataTypes.INTEGER, [[sequelize.literal('(SELECT COUNT(`posts`.`id`) FROM `posts` WHERE `posts`.`topicId` = `topics`.`id`)'), 'numPosts']])
    }
  });



  // CASE WHEN `featuredTopics`.`id` IS NOT NULL THEN `posts`.`topicId` = `featuredTopics`.`id` ELSE `posts`.`topicId` = `topics`.`id` END



  return topic;
};
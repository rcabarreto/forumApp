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
    }
  });

  return topic;
};
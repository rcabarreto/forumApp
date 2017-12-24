'use strict';

module.exports = (sequelize, DataTypes) => {
  const topic = sequelize.define('topic', {
    title: {
      type: DataTypes.STRING(60),
      allowNull: true
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    type: {
      type: DataTypes.ENUM,
      allowNull: true,
      values: ['public', 'private']
    }
  });

  return topic;
};
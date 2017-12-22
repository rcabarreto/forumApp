'use strict';

module.exports = (sequelize, DataTypes) => {
  const topic = sequelize.define('topic', {
    name: {
      type: DataTypes.STRING(60),
      allowNull: true
    }
  });

  return topic;
};
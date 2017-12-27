'use strict';

module.exports = (sequelize, DataTypes) => {
  const post = sequelize.define('post', {
    message: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  });

  return post;
};
'use strict';

module.exports = (sequelize, DataTypes) => {
  const forum = sequelize.define('forum', {
    title: {
      type: DataTypes.STRING(60),
      allowNull: true
    },
    description: {
      type: DataTypes.STRING(60),
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM,
      allowNull: true,
      values: ['open', 'close']
    },
    visibility: {
      type: DataTypes.ENUM,
      allowNull: true,
      values: ['public', 'private']
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  });

  return forum;
};
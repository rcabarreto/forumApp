'use strict';

module.exports = (sequelize, DataTypes) => {
  const forum = sequelize.define('forum', {
    title: {
      type: DataTypes.STRING(60),
      allowNull: true
    },
    description: {
      type: DataTypes.STRING(230),
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM,
      allowNull: false,
      values: ['open', 'close'],
      defaultValue: 'open'
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
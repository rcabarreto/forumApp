'use strict';

module.exports = (sequelize, DataTypes) => {
  return sequelize.define('tag', {
    tagname: {
      type: DataTypes.STRING,
      allowNull: false
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  });
};
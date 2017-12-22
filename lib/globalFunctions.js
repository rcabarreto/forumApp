'use strict';

const _ = require('underscore');
const moment = require('moment');

module.exports = {
  logDebug: function (logMessage) {
    if ((process.env.NODE_ENV || 'development') === 'development')
      console.log(logMessage);
  },
  logError: function (logMessage) {
    console.error(logMessage);
  }

};
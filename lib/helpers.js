'use strict';

const md5 = require('md5');

module.exports = function (handlebars) {
  return {
    ifCond: function (v1, v2, options) {
      if(v1 === v2) {
        return options.fn(this);
      }
      return options.inverse(this);
    },
    sum: function (value1, value2) {
      return value1+value2;
    },
    difference: function (value1, value2) {
      return value1-value2;
    },
    encodeMyString: function (inputData) {
      return new handlebars.SafeString(inputData);
    },
    getGravatarUrl: function (emailAddress) {
      let hash = md5(emailAddress);
      return 'https://www.gravatar.com/avatar/'+ hash;
    }

  }
};



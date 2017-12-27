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
    ifAdmin: (v1, options) => {
      if(v1 === 'admin') {
        return options.fn(this);
      }
      return options.inverse(this);
    },
    encodeMyString: function (inputData) {
      return new handlebars.SafeString(inputData);
    },
    getGravatarUrl: function (emailAddress) {
      let hash = md5(emailAddress);
      return 'https://www.gravatar.com/avatar/'+ hash +'?d=mm';
    }

  }
};



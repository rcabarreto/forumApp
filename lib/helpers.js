'use strict';

const striptags = require('striptags');
const md5 = require('md5');

module.exports = function (handlebars) {
  return {
    ifCond: function (v1, v2, options) {
      if(v1 === v2) {
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
    },
    truncateString: (string, size) => {

      let clearString = striptags(string);

      if (clearString.length > size)
        return clearString.substring(0,size)+'...';
      else
        return clearString;

    }

  }
};



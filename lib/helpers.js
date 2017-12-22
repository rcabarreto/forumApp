'use strict';

exports.ifCond = function (v1, v2, options) {
  if(v1 === v2) {
    return options.fn(this);
  }
  return options.inverse(this);
};

exports.sum = function (value1, value2) {
  return value1+value2;
};

exports.difference = function (value1, value2) {
  return value1-value2;
};

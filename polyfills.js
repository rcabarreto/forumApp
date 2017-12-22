'use strict';

let areIntlLocalesSupported = require('intl-locales-supported');

let localesMyAppSupports = [
  'pt-BR',
  'en-US'
];

if (global.Intl) {
  // Determine if the built-in `Intl` has the locale data we need.
  if (!areIntlLocalesSupported(localesMyAppSupports)) {
    // `Intl` exists, but it doesn't have the data we need, so load the
    // polyfill and replace the constructors with need with the polyfill's.

    console.log('Intl exists, but it doesn\'t have the data we need, so load the');

    let IntlPolyfill = require('intl');
    Intl.NumberFormat   = IntlPolyfill.NumberFormat;
    Intl.DateTimeFormat = IntlPolyfill.DateTimeFormat;
  }
} else {
  // No `Intl`, so use and load the polyfill.
  console.log('No Intl, so use and load the polyfill.');
  global.Intl = require('intl');
}

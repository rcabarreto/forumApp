
$(document).ready(function(e){
  // Bug fix for text fields when opening TinyMCE and/or MoxieManager windows inside a Bootstrap Modal.
  $(document).on('focusin', function(e) {
    if ($(e.target).closest(".mce-window").length || $(e.target).closest(".moxman-window").length) {
      e.stopImmediatePropagation();
    }
  });
});




(function ($) {
  $.fn.serializeFormJSON = function () {

    var o = {};
    var a = this.serializeArray();
    $.each(a, function () {
      if (o[this.name]) {
        if (!o[this.name].push) {
          o[this.name] = [o[this.name]];
        }
        o[this.name].push(this.value || '');
      } else {
        o[this.name] = this.value || '';
      }
    });
    return o;
  };
})(jQuery);




/*! jquery-password-generator-plugin - v0.0.0 - 2015-10-23
* Copyright (c) 2015 Sergey Sokurenko; Licensed MIT */
(function ($) {
  $.passGen = function (options) {
    // Override default options with passed-in options
    options = $.extend({}, $.passGen.options, options);

    // Local varialbles declaration
    var charsets, charset = '', password = '', index;

    // Available character lists
    charsets = {
      'numeric'   : '0123456789',
      'lowercase' : 'abcdefghijklmnopqrstuvwxyz',
      'uppercase' : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      'special'   : '~!@#$%^&*()-+[]{}<>?'
    };

    // Defining merged character set
    $.each(charsets, function(key, value) {
      if (options[key]) {
        charset += value;
      }
    });

    // Generating the password
    for (var i=0; i< options.length; i++) {
      // defining random character index
      index = Math.floor(Math.random() * (charset.length));
      // adding the character to the password
      password += charset[index];
    }

    // Returning generated password value
    return password;
  };

  // Default options
  $.passGen.options = {
    'length' : 10,
    'numeric' : true,
    'lowercase' : true,
    'uppercase' : true,
    'special'   : false
  };
}(jQuery));
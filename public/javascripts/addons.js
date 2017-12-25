
$(document).ready(function(e){
  // Bug fix for text fields when opening TinyMCE and/or MoxieManager windows inside a Bootstrap Modal.
  $(document).on('focusin', function(e) {
    if ($(e.target).closest(".mce-window").length || $(e.target).closest(".moxman-window").length) {
      e.stopImmediatePropagation();
    }
  });
});



/*jslint browser: true*/
/*global $, jQuery, alert*/
(function($) {
  'use strict';

  $(function() {

    $(document).ready(function() {
      function triggerClick(elem) {
        $(elem).click();
      }
      var $progressWizard = $('.stepper'),
        $tab_active,
        $tab_prev,
        $tab_next,
        $btn_prev = $progressWizard.find('.prev-step'),
        $btn_next = $progressWizard.find('.next-step'),
        $tab_toggle = $progressWizard.find('[data-toggle="tab"]'),
        $tooltips = $progressWizard.find('[data-toggle="tab"][title]');

      // To do:
      // Disable User select drop-down after first step.
      // Add support for payment type switching.

      //Initialize tooltips
      $tooltips.tooltip();

      //Wizard
      $tab_toggle.on('show.bs.tab', function(e) {
        var $target = $(e.target);

        if (!$target.parent().hasClass('active, disabled')) {
          $target.parent().prev().addClass('completed');
        }
        if ($target.parent().hasClass('disabled')) {
          return false;
        }
      });

      $btn_next.on('click', function() {
        $tab_active = $progressWizard.find('.active');

        $tab_active.next().removeClass('disabled');

        $tab_next = $tab_active.next().find('a[data-toggle="tab"]');
        triggerClick($tab_next);

      });
      $btn_prev.click(function(e) {
        var $target = $(e.target);

        $target.parent().prev().removeClass('completed');

        $tab_active = $progressWizard.find('.active');
        $tab_prev = $tab_active.prev().find('a[data-toggle="tab"]');

        triggerClick($tab_prev);
      });
    });
  });

}(jQuery, this));


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

$(document).ready(function() {
  // DOM ready

  // Load profile if it exits
  loadProfile();
});


$('#loginForm').on('submit', function (e) {
  e.preventDefault();

  var myForm = $(this);
  var formData = myForm.serializeFormJSON();

  // var googleUrl = 'http://picasaweb.google.com/data/entry/api/user/'+formData.email+'?alt=json';

  // $.getJSON(googleUrl, function(data) {
  //   console.log(data.entry.gphoto$nickname.$t);
  //   console.log(data.entry.gphoto$thumbnail.$t);
  //   setLocalStorageData(data.entry.gphoto$nickname.$t, formData.email, data.entry.gphoto$thumbnail.$t)
  // });


  // $.getJSON(googleUrl).done(function(data) {
  //   console.log(data.entry.gphoto$nickname.$t);
  //   console.log(data.entry.gphoto$thumbnail.$t);
  //   setLocalStorageData(data.entry.gphoto$nickname.$t, formData.email, data.entry.gphoto$thumbnail.$t)
  // }).fail(function () {
  //   console.log('Erro!');
  // });


  $.ajax({
    url: "/account/signin",
    type: "POST",
    data: formData,
    success: function(data){
      $(location).attr('href','/');
    },
    error: function (err) {
      var errorJson = err.responseJSON;

      $('#loginForm').prepend('' +
        '<div class="alert alert-danger alert-dismissible" role="alert">' +
        '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
        '<strong>Oh snap!</strong> Change a few things up and try submitting again' +
        '</div>');


    }
  });


});





/**
 * Function that gets the data of the profile in case
 * thar it has already saved in localstorage. Only the
 * UI will be update in case that all data is available
 *
 * A not existing key in localstorage return null
 *
 */
function getLocalProfile(callback){
  var profileImgSrc      = localStorage.getItem("PROFILE_IMG_SRC");
  var profileName        = localStorage.getItem("PROFILE_NAME");
  var profileReAuthEmail = localStorage.getItem("PROFILE_REAUTH_EMAIL");

  if(profileName !== null
    && profileReAuthEmail !== null
    && profileImgSrc !== null) {
    callback(profileImgSrc, profileName, profileReAuthEmail);
  }
}


function loadProfile() {
  if(!supportsHTML5Storage()) { return false; }

  getLocalProfile(function(profileImgSrc, profileName, profileReAuthEmail) {
    //changes in the UI
    $("#profile-img").attr("src",profileImgSrc);
    $("#profile-name").html(profileName);
    $("#reauth-email").html(profileReAuthEmail);
    $("#inputEmail").hide().val(profileReAuthEmail);
    $("#remember").hide();
  });
}


function supportsHTML5Storage() {
  try {
    return 'localStorage' in window && window['localStorage'] !== null;
  } catch (e) {
    return false;
  }
}


function setLocalStorageData(username, email, thumbnail) {
  if(!supportsHTML5Storage()) { return false; }
  localStorage.setItem("PROFILE_NAME", username);
  localStorage.setItem("PROFILE_REAUTH_EMAIL", email);
  localStorage.setItem("PROFILE_IMG_SRC", thumbnail );
}


function clearLocalStorage() {
  localStorage.removeItem("PROFILE_IMG_SRC");
  localStorage.removeItem("PROFILE_NAME");
  localStorage.removeItem("PROFILE_REAUTH_EMAIL");
}
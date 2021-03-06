
tinymce.init({
  selector: '.newTopicDescription',
  height: 250,
  theme: 'modern',
  plugins: 'print preview searchreplace autolink directionality visualblocks visualchars fullscreen image link media template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists textcolor wordcount imagetools contextmenu colorpicker textpattern help',
  toolbar1: 'formatselect | bold italic underline strikethrough forecolor | link unlink | removeformat | preview',
  toolbar2: "alignleft aligncenter alignright alignjustify | numlist bullist | undo redo | table | hr | image media code",
  menubar: false,
  content_css : '/stylesheets/customTinymceStyle.css',
  image_advtab: true
});

tinymce.init({
  selector: '.newForumDescription',
  height: 150,
  theme: 'modern',
  plugins: 'print preview searchreplace autolink directionality visualblocks visualchars fullscreen image link media template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists textcolor wordcount imagetools contextmenu colorpicker textpattern help',
  toolbar1: 'formatselect | bold italic underline strikethrough forecolor | link unlink | removeformat | preview',
  toolbar2: "alignleft aligncenter alignright alignjustify | numlist bullist | undo redo | table | hr | image media code",
  menubar: false,
  content_css : '/stylesheets/customTinymceStyle.css',
  image_advtab: true
});

(function($) {
  $.fn.answerThisMessage = function() {
    return this.each(function() {
      $(this).click(function () {
        var messageContent = $(this).parent().parent().prev().html();
        tinymce.get("newPostMessage").execCommand('mceInsertContent', false, '<blockquote>'+ messageContent +'</blockquote><p></p>');
        $("html, body").animate({ scrollTop: $(document).height()-$(window).height() });
      });
    });
  };

  $.fn.gotoMessageEditor = function() {
    return this.each(function() {
      $(this).click(function () {
        $("html, body").animate({ scrollTop: $(document).height()-$(window).height() });
      });
    });
  };

}( jQuery ));


function deletePost(postId) {

  $('#confirmDeleteModal').modal('hide');

  $.ajax({
    url: "/post/"+postId,
    type: "DELETE",
    success: function(data){
      // alert(JSON.stringify(data));
      $('#message-'+postId).fadeOut('slow');
    },
    error: function (err) {
      var errorJson = err.responseJSON;
      alert(errorJson);
    }
  });

}


$('.answerMessage').answerThisMessage();
$('.gotoMessageEditor').gotoMessageEditor();
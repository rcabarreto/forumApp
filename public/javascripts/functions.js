

tinymce.init({
  selector: 'textarea',
  height: 260,
  theme: 'modern',
  plugins: 'print preview searchreplace autolink directionality visualblocks visualchars fullscreen image link media template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists textcolor wordcount imagetools contextmenu colorpicker textpattern help',
  toolbar1: 'formatselect | bold italic underline strikethrough forecolor backcolor | link unlink | alignleft aligncenter alignright alignjustify | numlist bullist outdent indent | removeformat | preview',
  toolbar2: "fontselect fontsizeselect | cut copy paste | undo redo | table | hr | subscript superscript | image media code",
  menubar: false,
  image_advtab: true
});





function sendNotification(title, message, type) {

  if (!type)
    type='info';

  // success, info, warning, danger
  $.notify({
    // options
    icon: 'glyphicon glyphicon-warning-sign',
    title: title,
    message: message
  },{
    // settings
    element: 'body',
    position: null,
    type: type,
    allow_dismiss: false,
    newest_on_top: true,
    showProgressbar: false,
    placement: {
      from: "top",
      align: "right"
    },
    offset: 20,
    spacing: 10,
    z_index: 1031,
    delay: 5000,
    timer: 1000,
    url_target: '_blank',
    mouse_over: null,
    animate: {
      enter: 'animated fadeInDown',
      exit: 'animated fadeOutUp'
    },
    onShow: null,
    onShown: null,
    onClose: null,
    onClosed: null,
    icon_type: 'class',
    template: '<div data-notify="container" class="col-xs-11 col-sm-3 alert alert-{0}" role="alert">' +
    '<button type="button" aria-hidden="true" class="close" data-notify="dismiss">×</button>' +
    '<span data-notify="icon"></span> ' +
    '<span data-notify="title">{1}</span> ' +
    '<span data-notify="message">{2}</span>' +
    '<div class="progress" data-notify="progressbar">' +
    '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
    '</div>' +
    '</div>'
  });

}
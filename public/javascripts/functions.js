
function dateSorter(a, b) {
  return new Date(moment(b, 'DD/MM/YYYY').format()) - new Date(moment(a, 'DD/MM/YYYY').format());
}

function moneySorter(a, b) {
  a = a.toString().replace(/\./g, '').replace(/,/g, '\.').replace(/R/g, '').replace(/\$/g, '');
  b = b.toString().replace(/\./g, '').replace(/,/g, '\.').replace(/R/g, '').replace(/\$/g, '');

  a = parseFloat(a);
  b = parseFloat(b);

  if (a > b) return 1;
  if (a < b) return -1;
  return 0;
}





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




// Form masking
$(document).ready(function(){

  $('#accountList').on('editable-save.bs.table', function (editable, field, row, oldValue, el) {

    var formData = {
      field: field,
      id: row.id,
      name: row.name,
      olddescription: oldValue
    };

    console.log(formData);

    $.ajax({
      url: "/account/updateacount",
      type: "POST",
      data: formData,
      success: function(data){
        // alert(JSON.stringify(data));
        sendNotification('Sucesso','Result ok!','success');
      },
      error: function (err) {
        var errorJson = err.responseJSON;
        alert(errorJson);
      }
    });

  });

  $('#monthlyBillsList').on('editable-save.bs.table', function (editable, field, row, oldValue, el) {

    var formData = {
      field: field,
      id: row.id,
      description: row.description,
      olddescription: oldValue
    };

    $.ajax({
      url: "/monthlybill/updatedescription",
      type: "POST",
      data: formData,
      success: function(data){
        // alert(JSON.stringify(data));
        sendNotification('Sucesso','Result ok!','success');
      },
      error: function (err) {
        var errorJson = err.responseJSON;
        alert(errorJson);
      }
    });

  });


  $('#transactionList').on('editable-save.bs.table', function (editable, field, row, oldValue, el) {

    var formData = {
      field: field,
      id: row.id,
      type: row.type,
      description: row.description,
      olddescription: oldValue
    };

    $.ajax({
      url: "/"+row.type+"/updatedescription",
      type: "POST",
      data: formData,
      success: function(data){
        // alert(JSON.stringify(data));
        sendNotification('Sucesso','Result ok!','success');
      },
      error: function (err) {
        var errorJson = err.responseJSON;
        alert(errorJson);
      }
    });

  });



  // START MONEY MASK FOR ALL CURRENCY FIELDS
  $('input.money').maskMoney();

  // Other Examples of mask plugin
  // $('input.date').mask('00/00/0000');
  // $('.time').mask('00:00:00');
  // $('.date_time').mask('00/00/0000 00:00:00');
  // $('.cep').mask('00000-000');
  // $('.phone').mask('0000-0000');
  // $('.phone_with_ddd').mask('(00) 0000-0000');
  // $('.phone_us').mask('(000) 000-0000');
  // $('.mixed').mask('AAA 000-S0S');
  // $('.cpf').mask('000.000.000-00');
  // $('.cnpj').mask('00.000.000/0000-00');
  // $('input.money').mask('000.000.000.000.000,00', {placeholder: "0,00",reverse: true});
  // $('.money2').mask("#.##0,00", {reverse: true});
  // $('.percent').mask('##0,00%', {reverse: true});
  // $('.clear-if-not-match').mask("00/00/0000", {clearIfNotMatch: true});
  // $('.placeholder').mask("00/00/0000", {placeholder: "__/__/____"});


  // MAKE ALL CLICKABLE ROWS ACTUALLY CLICKABLE
  if($(".clickable-row").attr('data-href')) {
    $(".clickable-row").click(function() {
      window.location = $(this).data("href");
    });
  }


  $('#newTransactionDatePicker').datetimepicker({
    defaultDate: new Date(),
    locale: 'pt-BR',
    format: 'YYYY-MM-DD 00:00:00'
  });


  $('#confirmTransactionDatePicker').datetimepicker({
    defaultDate: new Date(),
    locale: 'pt-BR',
    format: 'YYYY-MM-DD 00:00:00'
  });


  ////////////////////////////////
  // DATE PICKER INITIALIZATION //
  ////////////////////////////////
  $('#globalDatePicker').datetimepicker({
    viewMode: 'months',
    format: 'MM/YYYY'
  }).on('dp.change', function (e) {
    $.get( "/setdate", { currMonth: e.date.month(), currYear: e.date.year() }, function () {
      location.reload();
    } );
  });

  $('#buttonPrevMonth').on('click', function (e) {
    $.get( "/previousmonth", function () {
      location.reload();
    } );
  });

  $('#buttonNextMonth').on('click', function (e) {
    $.get( "/nextmonth", function () {
      location.reload();
    } );
  });



  // $('#transactionList').DataTable({
  //   "pageLength": 25,
  //   "dom": "<'panel-heading'<'row'<'col-sm-6'l><'col-sm-6'f>>><'row'<'col-sm-12'tr>><'panel-footer'<'row'<'col-sm-5'i><'col-sm-7'p>>>"
  // });



});









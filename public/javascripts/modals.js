
//////////////////////////////////////////////
// TRANSACTION CONFIRMATION MODAL FUNCTIONS //
//////////////////////////////////////////////
$('#confirmTransactionModal').on('show.bs.modal', function (event) {

  var modal = $(this);

  var button = $(event.relatedTarget);

  var transactioncode =  button.data('transactioncode');
  var installmentcode = button.data('installmentcode');
  var installmentamount = button.data('installmentamount');
  var installmentdate = button.data('installmentdate');
  var confirmAccountId = button.data('accountid');
  var confirmDestAccountId = button.data('destaccountid');
  var transactionType = button.data('transactiontype');

  $.getJSON("/api/useraccounts", null, function(data) {
    $(".accountList option").remove();
    $.each(data, function(index, item) {
      $(".accountList").append(
        $("<option></option>").text(item.name).val(item.id)
      );
    });
    modal.find('#confirmAccountId').val(confirmAccountId);
  });


  // set confirmation date
  installmentdate = moment(installmentdate).format();
  installmentdate = new Date(installmentdate);

  $('#confirmTransactionDatePicker').data("DateTimePicker").date(installmentdate);


  installmentamount = installmentamount.toString().replace(/\./g, ',');

  modal.find('#confirmTransactionId').val(transactioncode);
  modal.find('#confirmInstallmentId').val(installmentcode);
  modal.find('#confirmInstallmentAmount').val(installmentamount);
  modal.find('#confirmTransactionType').val(transactionType);
  modal.find('#confirmDestAccountId').val(confirmDestAccountId);
  modal.find('#confirmInstallmentAmount').maskMoney('mask', installmentamount );

});


$('#confirmTransactionForm').on('submit', function (e) {
  e.preventDefault();

  var myForm = $(this);
  var formData = myForm.serializeFormJSON();

  $.ajax({
    url: "/transaction/confirm",
    type: "POST",
    data: formData,
    success: function(data){
      location.reload();
    },
    error: function (err) {
      var errorJson = err.responseJSON;

      $('#confirmTransactionForm .modal-body').prepend('' +
        '<div class="alert alert-danger alert-dismissible" role="alert">' +
        '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
        '<strong>'+errorJson.title+'</strong> '+errorJson.message +
        '</div>');
    }
  });

});


$('#newAccountModal').on('show.bs.modal', function (event) {

  $('#accountTypeCreditFields').hide();

  $('#newAccountForm input[name=type]:radio').on('change', function() {
    var selectedType = $('input[name=type]:checked', '#newAccountForm').val();
    if (selectedType === 'credit') {
      $('#accountTypeCreditFields').show();
    } else {
      $('#accountTypeCreditFields').hide();
    }
  });

});


$('#newAccountForm').on('submit', function (e) {
  e.preventDefault();

  var myForm = $(this);
  var formData = myForm.serializeFormJSON();

  $.ajax({
    url: "/account",
    type: "POST",
    data: formData,
    success: function(data){
      location.reload();
    },
    error: function (err) {
      var errorJson = err.responseJSON;
      $('#newAccountForm .modal-body').prepend('' +
        '<div class="alert alert-danger alert-dismissible" role="alert">' +
        '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
        '<strong>'+errorJson.title+'</strong> '+errorJson.message +
        '</div>');
    }
  });

});


$('#transactionInstallmentsFields').on('show', function (event) {
  console.log('mostrando as parcelas!');
});


$('#transactionInstallments').on('change', function (event) {
  var installments = parseInt($(this).val());

  var amount = $('#transactionAmount').maskMoney('unmasked')[0];
  var installmentValue = amount/installments;

  installmentValue = parseFloat(installmentValue.toFixed(2));
  installmentValue = installmentValue.toString().replace(/\./g, ',')

  $('#transactionInstallmentsAmount').maskMoney('mask', installmentValue );
});


$('#transactionAmount').on('change', function (event) {
  var installments = parseInt($('#transactionInstallments').val());

  var amount = $('#transactionAmount').maskMoney('unmasked')[0];
  var installmentValue = amount/installments;

  installmentValue = parseFloat(installmentValue.toFixed(2));
  installmentValue = installmentValue.toString().replace(/\./g, ',')

  $('#transactionInstallmentsAmount').maskMoney('mask', installmentValue );
});


$('#transactionInstallmentsAmount').on('change', function (event) {
  var installments = parseInt($('#transactionInstallments').val());
  var installmentAmount = $(this).maskMoney('unmasked')[0];
  var installmentValue = installmentAmount*installments;

  installmentValue = parseFloat(installmentValue.toFixed(2));
  installmentValue = installmentValue.toString().replace(/\./g, ',')

  $('#transactionAmount').maskMoney('mask', installmentValue );
});


// Confirm modal controller
$('#newTransactionModal').on('show.bs.modal', function (event) {

  $('#transactionInstallmentsFields').hide();
  $('#transactionRecurrenryFields').hide();
  $('#transactionDestAccountField').hide();

  var button = $(event.relatedTarget);
  var code = button.data('code');
  var url = button.data('url');
  var modal = $(this);

  var selectedType = $('input[name=type]:checked', '#newTransactionForm').val();
  var selectedRepeat = $('input[name=repeat]:checked', '#newTransactionForm').val();

  $('#newTransactionForm input[name=repeat]:radio').on('change', function() {
    var selectedRepeat = $('input[name=repeat]:checked', '#newTransactionForm').val();

    $('#transactionInstallmentsFields').hide();
    $('#transactionRecurrenryFields').hide();

    if (selectedRepeat === 'installment') {
      $('#transactionInstallmentsFields').show();
      $('#transactionInstallments').val('1');
      $('#transactionInstallmentsAmount').val('0');
    } else if (selectedRepeat === 'recurrent') {
      $('#transactionRecurrenryFields').show();
    }

  });

  $('#newTransactionForm input[name=type]:radio').on('change', function() {
    selectedType = $('input[name=type]:checked', '#newTransactionForm').val();

    if (selectedType === 'transfer') {
      $('#transactionCategoryField').hide();
      $('#transactionDestAccountField').show();
    } else {
      $('#transactionDestAccountField').hide();
      $('#transactionCategoryField').show();

      $.getJSON("/api/loadcategories/"+selectedType, null, function(data) {
        $("#categoryList option").remove();
        $.each(data, function(index, item) {
          $("#categoryList").append(
            $("<option></option>").text(item.name).val(item.id)
          );
        });
      });
    }

  });

  $.getJSON("/api/useraccounts", null, function(data) {
    $(".accountList option").remove(); // Remove all <option> child tags.
    $.each(data, function(index, item) { // Iterates through a collection
      $(".accountList").append( // Append an object to the inside of the select box
        $("<option></option>").text(item.name).val(item.id)
      );
    });
  });

  $.getJSON("/api/loadcategories/"+selectedType, null, function(data) {
    $("#categoryList option").remove();
    $.each(data, function(index, item) {
      $("#categoryList").append(
        $("<option></option>").text(item.name).val(item.id)
      );
    });
  });

});


$('#newTransactionForm').on('submit', function (e) {
  e.preventDefault();

  var myForm = $(this);
  var formData = myForm.serializeFormJSON();

  $.ajax({
    url: "/transaction",
    type: "POST",
    data: formData,
    success: function(data){
      // myForm[0].reset();
      // $('#newTransactionModal').modal('hide');
      location.reload();
    },
    error: function (err) {
      var errorJson = err.responseJSON;

      $('#newTransactionForm .modal-body').prepend('' +
        '<div class="alert alert-danger alert-dismissible" role="alert">' +
        '<span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span> ' +
        '<strong>'+errorJson.title+'</strong><br>'+errorJson.message +
        '</div>');
    }
  });

});

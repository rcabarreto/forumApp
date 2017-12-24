
$('#newTopicModal').on('show.bs.modal', function (event) {

  var button = $(event.relatedTarget);

  var modalTitle = button.data('title');
  // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
  // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
  var modal = $(this)

  modal.find('.modal-title').text(modalTitle);

})

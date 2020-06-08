
$('#res0').DataTable({
    order: [[3,'desc']],
    pagingType: 'full_numbers',
    searching: true
});

$('#myModal').on('shown.bs.modal', function () {
    $('#myInput').trigger('focus')
  })
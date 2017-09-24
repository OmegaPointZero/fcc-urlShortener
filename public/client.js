$(function() {
  
  var redirect = function(url){
    window.location.replace(url);
  }

  $('form').submit(function(event) {
    event.preventDefault();
    var url = $('input').val();
    var sUrl = '/new/' + url;
    redirect(sUrl);
/*    $.post('/dreams?' + $.param({dream: dream}), function() {
      $('<li></li>').text(dream).appendTo('ul#dreams');
      $('input').val('');
      $('input').focus(); */
    });
  });
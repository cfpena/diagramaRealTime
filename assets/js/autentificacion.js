$(document).ready(function(){
$('#login').click(login);
$('#registro').click(registro);
});

function login(){
  $.post("/auth/local",
  {identifier: $('#usuarioLogin').val(), password: $('#claveLogin').val()}
  ,
  function(data, status){
      if(data=='true')
      window.location.assign("/principal");
    }).fail(function() {
    alert( "error" );
  });;
}

function registro(){
  $.post("/auth/local/register",
  {username:  $('#username').val(),email: $('#email').val(), password: $('#clave').val()}
  ,
  function(data, status){
    window.location.assign("/");

    }).fail(function() {
    alert( "error" );
  });
}

var id;

$(document).ready(function(){
    $('.edit').click(function(event){
      var id =$(this).attr("data-id");
      document.cookie="diagramID=" + id;
      window.location.replace("/workarea");
    });

    $('#nuevo').click(function(){
      document.cookie="diagramID=-1";
      window.location.replace("/workarea");
    });

    $('.destroy').click(function(event){
      var id =$(this).attr("data-id");
      $("#div" + id ).empty();
      eliminar(id);
    });


    $('.share').click(function(event){
      //$('#modalEntidad').openModal();
      $('#compartirModal').openModal();
      id =$(this).attr("data-id");
    });

    $('#compartirBoton').click(function(event){

      var username = $('#username').val();
      compartir(id,username);
    });

});

function eliminar(id){
    $.post("/diagramaDestroy",
    {id: id}
    ,
    function(data, status){



      }).fail(function() {
      alert( "error" );
    });
}

function compartir(id,username){
  
  $.post("/diagramaShare",
  {id: id, username: username}
  ,
  function(data, status){
    }).fail(function() {
    alert( "error" );
  });

}

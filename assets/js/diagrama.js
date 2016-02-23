$(document).ready(function(){
/*  io.socket.get('/diagramaSave');
io.socket.on('diagrama', function(obj) {
    if(obj.verb === 'messaged') {
        console.log(obj);
        // Do something fun with the message object!
    }
});*/
//io.socket.on('diagrama', function(event){console.log(event);})

    // the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered

    $('#entidad').click(function(){
      //$('#modalEntidad').openModal();

      $('#nombreEntidad').val('');
      $('#atributosEntidad').val('');
      $('#modalEntidad').openModal();
      eliminar=0;
    });

    $('#seleccionar').click(function(){ eliminar=0});
    $('#eliminar').click(function(){ eliminar=1});

    $('#botonEntidad').click(function(){
        agregarEntidad();
        //entidad = graph.getCell(idActual);
        //entidad.set('name', $('nombreEntidad').text);
    });
    $('#guardar').click(function(){
      if( diagramaID==-1)
      $('#modalGuardar').openModal();
      else {
        guardar();
      }
    });
    $('#exportar').click(exportar);
    $('#compartir').click(function(){
      cargar(diagramaID);
    });
    $('#guardarModal').click(guardar);

    var match = document.cookie.match(new RegExp("diagramID" + '=([^;]+)'));
    if (match){
      diagramaID=match[1];
      if(match[1]!='-1')
      cargar(match[1]);

    }


    io.socket.on('connect', function socketConnected() {
       io.socket.on('diagrama', function messageReceived(message) {
         console.log("hay cambio");
         reload(message);
         });
       });
});



var graph = new joint.dia.Graph();

var paper = new joint.dia.Paper({
    el: $('#paper'),
    width: 1200,
    height: 600,
    gridSize: 1,
    model: graph
});

paper.on('cell:pointerup',
    function(cellView, evt, x, y) {

      guardar();
      if(eliminar==0){
    /*  $('#nombreEntidad').text(cellView.model.get('name'));
      $('#atributosEntidad').text(cellView.model.get('attributes'));
      idActual = cellView.model.id;*/
    }
    else{
      cellView.model.remove();
      eliminar=0;
    }
         //cellView.model.get('name')
    }
);
/*
graph.on('change', function(cell) {
  guardar();
})
*/
elements= graph.getElements();
elements.forEach(function(element){



});




var uml = joint.shapes.uml;
var entidades = new Array();
var relaciones = new Array();
var idActual;
var eliminar = 0;
var diagramaID=-1;

function agregarEntidad(){
  var entidad = new uml.Class({
      position: { x:630  , y: 190 },
      size: { width: 160, height: 100 },
      name: $('#nombreEntidad').val(),
      attributes: [$("#atributosEntidad").val().split()],
      methods: [],
      attrs: {
          '.uml-class-name-rect': {
              fill: '#ff8450',
              stroke: '#fff',
              'stroke-width': 0.5

          },
          '.uml-class-attrs-rect, .uml-class-methods-rect': {
              fill: '#fe976a',
              stroke: '#fff',
              'stroke-width': 0.5,
              magnet: true
          },
          '.uml-class-attrs-text': {
              'ref-y': 0.5,
              'y-alignment': 'middle'
          }
      },

  });
  graph.addCell(entidad);
  entidades.push(entidad.toJSON());

}



function agregarEntidadP(x,y,name,attributes,id){
  var entidad = new uml.Class({
      id: String(id),
      position: { x: x  , y: y },
      size: { width: 160, height: 100 },
      name: name,
      attributes: attributes,
      methods: [],
      attrs: {
          '.uml-class-name-rect': {
              fill: '#ff8450',
              stroke: '#fff',
              'stroke-width': 0.5

          },
          '.uml-class-attrs-rect, .uml-class-methods-rect': {
              fill: '#fe976a',
              stroke: '#fff',
              'stroke-width': 0.5,
              magnet: true
          },
          '.uml-class-attrs-text': {
              'ref-y': 0.5,
              'y-alignment': 'middle'
          }
      },

  });
/*
  entidad.on('change:position', function() {

     guardar();

   });*/
  graph.addCell(entidad);
  entidades.push(entidad.toJSON());

}

function agregarLink(source,target){
 var r = new uml.Aggregation({ source: { id: source }, target: { id: target }});

 r.attr({
    '.connection': { stroke: 'black' },
    '.marker-source': { fill: 'red', d: '' },
    '.marker-target': { fill: 'yellow', d: '' }
});
 graph.addCell(r);

}



function guardar(){
  var ele= [];

  links=graph.getLinks();
  elements = graph.getElements();

  links.forEach(function(relacion,index){
      relaciones.push(relacion.toJSON());
  });

  elements.forEach(function(element,index){
      ele.push(element.toJSON());
  });


if (diagramaID=='-1'){

  $.post("/diagramCreate",
  {nombre: $('#nombreDiagrama').val(), entidades: ele, relaciones: relaciones}
  ,
  function(data, status){

    }).fail(function() {
    alert( "error" );
  });
  }
  else {

      $.post("/diagramaSave",
      {id: diagramaID, entidades: ele, relaciones: relaciones}
      ,
      function(data, status){}).fail(function() {
        alert( "error" );
      });
  }
}

function reload(diagrama){
  diagrama=diagrama.data;

  entidades = graph.getElements();
  relaciones = graph.getLinks();

  entidades.forEach(function(entidad){
    entidad.remove();
  });
  relaciones.forEach(function(relacion){
    relacion.remove();
  });

if(diagrama.entidades!=undefined){
  diagrama.entidades.forEach(function(entidad,index){

    var ent = entidad;

    agregarEntidadP(parseInt(ent.position.x),parseInt(ent.position.y),ent.name,ent.attributes,ent.id);
  });
}
if(diagrama.relaciones!=undefined){
  diagrama.relaciones.forEach(function(relacion,index){
    var rel = relacion;
    agregarLink(rel.source.id,rel.target.id);
  });}


}

function cargar(id){
  $.get( "/loadOne", {diagramaId: id}, function(data) {

      data.entidades.forEach(function(entidad,index){
        ent = entidad.data;
        agregarEntidadP(parseInt(ent.position.x),parseInt(ent.position.y),ent.name,ent.attributes,ent.id);
      });
      data.relaciones.forEach(function(relacion,index){
        rel = relacion.data;
        agregarLink(rel.source.id,rel.target.id);
      });
    });
//graph.resetCells(graph.get("cells"));
//paper.render();

}
function download(filename, text) {
    var pom = document.createElement('a');
    pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    pom.setAttribute('download', filename);

    if (document.createEvent) {
        var event = document.createEvent('MouseEvents');
        event.initEvent('click', true, true);
        pom.dispatchEvent(event);
    }
    else {
        pom.click();
    }
}

function exportar(e){
e.preventDefault();
  var svgDoc = paper.svg;
var serializer = new XMLSerializer();
var svgString = serializer.serializeToString(svgDoc);
download('Diagrama.svg', svgString);


}


/*
var classes = {

    mammal: new uml.Interface({
        position: { x:300  , y: 50 },
        size: { width: 240, height: 100 },
        name: 'Mammal',
        attributes: ['dob: Date'],
        methods: ['+ setDateOfBirth(dob: Date): Void','+ getAgeAsDays(): Numeric'],
        attrs: {
            '.uml-class-name-rect': {
                fill: '#feb662',
                stroke: '#ffffff',
                'stroke-width': 0.5
            },
            '.uml-class-attrs-rect, .uml-class-methods-rect': {
                fill: '#fdc886',
                stroke: '#fff',
                'stroke-width': 0.5
            },
            '.uml-class-attrs-text': {
                ref: '.uml-class-attrs-rect',
                'ref-y': 0.5,
                'y-alignment': 'middle'
            },
            '.uml-class-methods-text': {
                ref: '.uml-class-methods-rect',
                'ref-y': 0.5,
                'y-alignment': 'middle'
            }

        }
    }),

    person: new uml.Abstract({
        position: { x:300  , y: 300 },
        size: { width: 260, height: 100 },
        name: 'Person',
        attributes: ['firstName: String','lastName: String'],
        methods: ['+ setName(first: String, last: String): Void','+ getName(): String'],
        attrs: {
            '.uml-class-name-rect': {
                fill: '#68ddd5',
                stroke: '#ffffff',
                'stroke-width': 0.5
            },
            '.uml-class-attrs-rect, .uml-class-methods-rect': {
                fill: '#9687fe',
                stroke: '#fff',
                'stroke-width': 0.5
            },
            '.uml-class-methods-text, .uml-class-attrs-text': {
                fill: '#fff'
            }
        }
    }),

    bloodgroup: new uml.Class({
        position: { x:20  , y: 190 },
        size: { width: 220, height: 100 },
        name: 'BloodGroup',
        attributes: ['bloodGroup: String'],
        methods: ['+ isCompatible(bG: String): Boolean'],
        attrs: {
            '.uml-class-name-rect': {
                fill: '#ff8450',
                stroke: '#fff',
                'stroke-width': 0.5,
            },
            '.uml-class-attrs-rect, .uml-class-methods-rect': {
                fill: '#fe976a',
                stroke: '#fff',
                'stroke-width': 0.5
            },
            '.uml-class-attrs-text': {
                ref: '.uml-class-attrs-rect',
                'ref-y': 0.5,
                'y-alignment': 'middle'
            },
            '.uml-class-methods-text': {
                ref: '.uml-class-methods-rect',
                'ref-y': 0.5,
                'y-alignment': 'middle'
            }
        }
    }),

    address: new uml.Class({
        position: { x:630  , y: 190 },
        size: { width: 160, height: 100 },
        name: 'Address',
        attributes: ['houseNumber: Integer','streetName: String','town: String','postcode: String'],
        methods: [],
        attrs: {
            '.uml-class-name-rect': {
                fill: '#ff8450',
                stroke: '#fff',
                'stroke-width': 0.5
            },
            '.uml-class-attrs-rect, .uml-class-methods-rect': {
                fill: '#fe976a',
                stroke: '#fff',
                'stroke-width': 0.5,
            },
            '.uml-class-attrs-text': {
                'ref-y': 0.5,
                'y-alignment': 'middle'
            }
        },

    }),

    man: new uml.Class({
        position: { x:200  , y: 500 },
        size: { width: 180, height: 50 },
        name: 'Man',
        attrs: {
            '.uml-class-name-rect': {
                fill: '#ff8450',
                stroke: '#fff',
                'stroke-width': 0.5
            },
            '.uml-class-attrs-rect, .uml-class-methods-rect': {
                fill: '#fe976a',
                stroke: '#fff',
                'stroke-width': 0.5
            }
        }
    }),

    woman: new uml.Class({
        position: { x:450  , y: 500 },
        size: { width: 180, height: 50 },
        name: 'Woman',
        methods: ['+ giveABrith(): Person []'],
        attrs: {
            '.uml-class-name-rect': {
                fill: '#ff8450',
                stroke: '#fff',
                'stroke-width': 0.5
            },
            '.uml-class-attrs-rect, .uml-class-methods-rect': {
                fill: '#fe976a',
                stroke: '#fff',
                'stroke-width': 0.5
            },
            '.uml-class-methods-text': {
                'ref-y': 0.5,
                'y-alignment': 'middle'
            }
        }
    })


};

_.each(classes, function(c) { graph.addCell(c); });

var relations = [
    new uml.Generalization({ source: { id: classes.man.id }, target: { id: classes.person.id }}),
    new uml.Generalization({ source: { id: classes.woman.id }, target: { id: classes.person.id }}),
    new uml.Implementation({ source: { id: classes.person.id }, target: { id: classes.mammal.id }}),
    new uml.Aggregation({ source: { id: classes.person.id }, target: { id: classes.address.id }}),
    new uml.Composition({ source: { id: classes.person.id }, target: { id: classes.bloodgroup.id }})
];

_.each(relations, function(r) { graph.addCell(r); });
*/

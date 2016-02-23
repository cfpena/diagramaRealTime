/**
 * DiagramaController
 *
 * @description :: Server-side logic for managing diagramas
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

	create: function(req, res){

	var entidades = req.param('entidades');
	var relaciones = req.param('relaciones');
	var nombre = req.param('nombre');
	var usuario = req.user.username;
	var diagramaId;

	Diagrama.create({nombre: nombre, creador: usuario}).exec(function(err, result){


		if(entidades != undefined){
		entidades.forEach(function(data, index){
			result.entidades.add({data: data});
		});
	}
	if(relaciones != undefined){
		relaciones.forEach(function(data, index){
			result.relaciones.add({data: data});
		});
	}
	diagramaId = result.id;
	User.findOne(req.user.id).exec(function(err, user) {
	// handle error
	user.diagramas.add(result.id);
	user.save(function(err) {});
	result.save(function(err) {});


});


	});
	},
	list: function(req, res){
		Diagrama.find().populateAll().exec(function(err, diagrama) {
				res.view({diagrama: diagrama});
		});
	},
	loadOne: function(req,res){

		Diagrama.findOne(req.param('diagramaId')).populate('entidades').populate('relaciones').populate('usuarios').exec(function(err, diagrama) {

				res.send(diagrama);

		});
	},
	load: function(req,res){

		User.findOne(req.user.id).populate('diagramas').exec(function(err, user) {
				res.view({diagramas: user.diagramas, user: req.user});
		});
	},
	save: function (req,res){

		var entidades = req.param('entidades');
		var relaciones = req.param('relaciones');


		Diagrama.findOne(req.param('id')).populateAll().exec(function (err, diagrama){
			if(entidades != undefined){
				diagrama.entidades.forEach(function(entidad){
					Entidad.destroy(entidad.id).exec(function (err){});
				});

				entidades.forEach(function(data, index){
					diagrama.entidades.add({data: data});
				});
				}

				if(relaciones != undefined){
				diagrama.relaciones.forEach(function(relacion){
					Relacion.destroy(relacion.id).exec(function (err){});
				});


				relaciones.forEach(function(data, index){
					diagrama.relaciones.add({data: data});
					console.log("relacion");
				});
			}
				diagrama.save(function(err) {});
				sails.io.sockets.emit("diagrama", {verb:"saved", data:{entidades: entidades, relaciones: relaciones}});

		});
	},

		destroy: function (req,res){


					Diagrama.findOne(req.param('id')).populateAll().exec(function (err, diagrama){
							diagrama.entidades.forEach(function(entidad){
								Entidad.destroy(entidad.id).exec(function (err){});
							});
							diagrama.relaciones.forEach(function(relacion){
								Relacion.destroy(relacion.id).exec(function (err){});
							});
					Diagrama.destroy(req.param('id')).exec(function (err){});

				});


			},
		share: function(req,res){
			var userID;
			Diagrama.findOne(req.param('id')).populateAll().exec(function (err, diagrama){

				User.findOne({username:req.param('username')}).exec(function (err, user){
					if(!err){

						diagrama.usuarios.add(user.id);
						diagrama.save(function(err) {});
				}
			});


			});



		}



};

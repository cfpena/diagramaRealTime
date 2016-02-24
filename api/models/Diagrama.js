/**
 * Diagrama.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    nombre: {type:'string'},
    entidades : { collection: 'entidad', via: 'id'},
    relaciones: { collection: 'relacion', via: 'id' },
    creador: { type: 'string' },
    usuarios: { collection: 'user', via: 'diagramas'},
    imagen: {type: 'text'}

    }

};

const { Schema, model, Types } = require("mongoose");

const dataSchema = new Schema({
    codigo:{
        type: String,
        unique:true
    },
    nombre:{
        type: String
    },
    edad:{
        type: Number
    },
    direccion:{
        type:String
    },
    latlong:[Number],
    municipio:{
        type:String,
        default: 'Isla de la Juventud'
    },
    carnet:{
        type: String
    },
    fecha_primera:{
        type: Date,
    },
    fecha_muestra:{
        type: Date,
    },
    centro:{
        type: String,
        enum:['Hospital','Policlínico 1', 'Policlínico 2', 'Policlínico 3'],
        default: "Hospital"
    },
    fecha_suma:{
        type: Date,
    },
    resultado:{
        type: String,
        enum:['NEGATIVO','POSITIVO'],
        default: "NEGATIVO"
    },
    date_until:{type: Date, default: +new Date() + 30*24*60*60*1000},
    createdAt:{
        type: Date,
        default: Date.now()
    },
    deletedAt: Date
});

module.exports =  model('Epidemia',dataSchema);
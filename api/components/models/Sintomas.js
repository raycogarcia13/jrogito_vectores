const { Schema, model, Types } = require("mongoose");

const dataSchema = new Schema({
    name:{
        type: String,
        unique:true,
        required:true
    },
    descripcion:{
        type: String,
    }
});

module.exports =  model('Sintomas',dataSchema);
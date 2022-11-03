const { Schema, model, Types } = require("mongoose");

const dataSchema = new Schema({
    tipo:{
        type: String,
        unique:true,
        required:true
    },
    color:{
        type: String,
        required:true
    }
});

module.exports =  model('TipoEpidemia',dataSchema);
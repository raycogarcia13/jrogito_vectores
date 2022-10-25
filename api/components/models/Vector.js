const { Schema, model, Types } = require("mongoose");

const dataSchema = new Schema({
    calle:{
        type: String,
    },
    entre1:{
        type: String,
    },
    entre2:{
        type: String,
    },
    entre2:{
        type: String,
    },
    descripcion:{
        type: String,
    },
    latlong:[Number],
    createdAt:{
        type: Date,
        default: Date.now()
    },
    deletedAt: Date
});

module.exports =  model('Vector',dataSchema);
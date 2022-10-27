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
    manzana:{type: Number},
    descripcion:{
        type: String,
    },
    poblado:{type: String},
    larvas:{type: Boolean, default:false},
    latlong:[Number],
    createdAt:{
        type: Date,
        default: Date.now()
    },
    deletedAt: Date
});

module.exports =  model('Vector',dataSchema);
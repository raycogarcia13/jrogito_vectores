const ErrorHandler = require("../../utils/errorHandler");
const catchAsyncErrors = require("../../middlewares/catchAsyncErrors")
const bcrypt = require('bcryptjs')

const Vector = require('../models/Vector')

//get  =>[Get]/api/v1/matrix_reference
exports.all = catchAsyncErrors(async (req,res,next) =>{

    const all = await Vector.find();

    return res.json({
        status:"success",
        data:all
    })
})

//get  =>[Get]/api/v1/matrix_reference
exports.create = catchAsyncErrors(async (req,res,next) =>{
    const { calle, entre1, entre2, descripcion, latlong } = req.body;
    
    const data = await Vector.create({
        calle,
        entre1,
        entre2,
        descripcion,
        latlong
    });

    return res.json({
        status:"success",
        data
    })
})

//get  =>[Get]/api/v1/matrix_reference
exports.update = catchAsyncErrors(async (req,res,next) =>{
    let {calle, entre1, entre2, descripcion, latlong } = req.body;
    const {id } = req.params;
    
    let user = await Vector.findOneAndUpdate({_id:id},{
        calle, entre1, entre2, descripcion, latlong
    });

    return res.json({
        status:"success",
        data:user
    })
})

//delete  =>[Get]/api/v1/matrix_reference
exports.remove = catchAsyncErrors(async (req,res,next) =>{
    const {id } = req.params;
    
    console.log(id);

    await Vector.findByIdAndDelete(id);

    return res.json({
        status:"success",
        message:"vector.deleted"
    })
})


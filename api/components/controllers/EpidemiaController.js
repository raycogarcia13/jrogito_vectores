const ErrorHandler = require("../../utils/errorHandler");
const catchAsyncErrors = require("../../middlewares/catchAsyncErrors")
const bcrypt = require('bcryptjs')

const Epidemia = require('../models/Epidemia')

//get  =>[Get]/api/v1/matrix_reference
exports.all = catchAsyncErrors(async (req,res,next) =>{

    const all = await Epidemia.find().populate('tipo')

    return res.json({
        status:"success",
        data:all
    })
})

//get  =>[Get]/api/v1/matrix_reference
exports.create = catchAsyncErrors(async (req,res,next) =>{
    
    const {carnet} = req.body;
    
    const siglo = carnet.charAt(6);
    let year;
    if(siglo == 9)
        year = 1800;
    else if(siglo<=5)
        year = 1900;
    else
        year = 2000;

    const year_l = carnet.substr(0,2);
    year+=parseInt(year_l);
    const y_now = new Date().getFullYear();
    req.body.edad = y_now - year;  
    req.body.sexo = parseInt(carnet.substr(9,1))%2==0?'Masculino':'Femenino';  
    const data = await Epidemia.create(req.body);

    return res.json({
        status:"success",
        // data
    })
})

//get  =>[Get]/api/v1/matrix_reference
exports.update = catchAsyncErrors(async (req,res,next) =>{
    const {id } = req.params;
    
    let user = await Epidemia.findOneAndUpdate({_id:id},req.body);

    return res.json({
        status:"success",
        data:user
    })
})

//delete  =>[Get]/api/v1/matrix_reference
exports.remove = catchAsyncErrors(async (req,res,next) =>{
    const {id } = req.params;
    
    console.log(id);

    await Epidemia.findByIdAndDelete(id);

    return res.json({
        status:"success",
        message:"vector.deleted"
    })
})


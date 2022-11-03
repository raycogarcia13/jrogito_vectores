const ErrorHandler = require("../../utils/errorHandler");
const catchAsyncErrors = require("../../middlewares/catchAsyncErrors")

const TipoEpidemia = require('../models/TipoEpidemia')

//get  =>[Get]/api/v1/matrix_reference
exports.all = catchAsyncErrors(async (req,res,next) =>{

    const all = await TipoEpidemia.find();

    return res.json({
        status:"success",
        data:all
    })
})

//get  =>[Get]/api/v1/matrix_reference
exports.store = catchAsyncErrors(async (req,res,next) =>{
    
    const newed = await TipoEpidemia.create(req.body);

    return res.json({
        status:"success",
        data:newed
    })
})

//get  =>[Get]/api/v1/matrix_reference
exports.update = catchAsyncErrors(async (req,res,next) =>{
    const {id } = req.params;
    
    let data = await TipoEpidemia.findOneAndUpdate({_id:id},req.body);

    return res.json({
        status:"success",
        data
    })
})

//delete  =>[Get]/api/v1/matrix_reference
exports.remove = catchAsyncErrors(async (req,res,next) =>{
    const {id } = req.params;
    
    await TipoEpidemia.findByIdAndDelete(id);

    return res.json({
        status:"success",
        message:"tipo.deleted"
    })
})


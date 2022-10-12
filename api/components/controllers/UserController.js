const ErrorHandler = require("../../utils/errorHandler");
const catchAsyncErrors = require("../../middlewares/catchAsyncErrors")

const User = require('../models/User')

//get  =>[Get]/api/v1/matrix_reference
exports.users = catchAsyncErrors(async (req,res,next) =>{

    console.log('sii')
    const all = await User.find();

    return res.json({
        status:"success",
        data:all
    })
})


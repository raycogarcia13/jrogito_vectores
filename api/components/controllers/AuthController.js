const ErrorHandler = require("../../utils/errorHandler");
const catchAsyncErrors = require("../../middlewares/catchAsyncErrors")

const User = require('../models/User')

//get  =>[Get]/api/v1/matrix_reference
exports.login = catchAsyncErrors(async (req,res,next) =>{
    const {username, password} = req.body;


    console.log(username,password)
    const exist = await User.findOne({email:username}).select('+password');
    console.log(exist);
    if(!exist)
        return next(new ErrorHandler('auth.error',403))
        
    const pasv = await exist.comparePassword(password);
    if(!pasv)
        return next(new ErrorHandler('auth.error',403))


    return res.json({
        status:"success",
        user:exist,
        token:exist.getJwtToken()
    })
})


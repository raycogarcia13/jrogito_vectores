const ErrorHandler = require("../../utils/errorHandler");
const catchAsyncErrors = require("../../middlewares/catchAsyncErrors")
const bcrypt = require('bcryptjs')

const User = require('../models/User')

//get  =>[Get]/api/v1/matrix_reference
exports.users = catchAsyncErrors(async (req,res,next) =>{

    const all = await User.find();

    return res.json({
        status:"success",
        data:all
    })
})

//get  =>[Get]/api/v1/matrix_reference
exports.create = catchAsyncErrors(async (req,res,next) =>{
    const {name, email, password, role, } = req.body;
    
    const user = await User.create({
        name, email, password, role
    });

    return res.json({
        status:"success",
        data:user
    })
})

//get  =>[Get]/api/v1/matrix_reference
exports.update = catchAsyncErrors(async (req,res,next) =>{
    let {name, email, password, role } = req.body;
    const {id } = req.params;
    
    let user = await User.findOneAndUpdate({_id:id},{
        name, email, role
    });

    if(password){
        const hp = await bcrypt.hash(password, 10)
        user = await User.findOneAndUpdate({_id:id},{
            password: hp
        });
    }

    return res.json({
        status:"success",
        data:user
    })
})

//delete  =>[Get]/api/v1/matrix_reference
exports.remove = catchAsyncErrors(async (req,res,next) =>{
    const {id } = req.params;
    
    console.log(id);

    await User.findByIdAndDelete(id);

    return res.json({
        status:"success",
        message:"user.deleted"
    })
})


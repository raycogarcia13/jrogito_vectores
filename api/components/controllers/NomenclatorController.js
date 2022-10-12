const ErrorHandler = require("../../../utils/errorHandler");
const catchAsyncErrors = require("../../../middlewares/catchAsyncErrors")

const Diameter = require('../models/Diameter')

//get  =>[Get]/api/v1/matrix_reference
exports.getAll = catchAsyncErrors(async (req,res,next) =>{



    const endguns = await EndGun.find() ;



    return res.json({
        status:"success",
        data:{
            elcables_cond:electricCableCond,
        }
    })
})

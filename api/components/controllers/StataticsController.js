const ErrorHandler = require("../../utils/errorHandler");
const catchAsyncErrors = require("../../middlewares/catchAsyncErrors")
const bcrypt = require('bcryptjs')

const Epidemia = require('../models/Epidemia')
const Sintomas = require('../models/Sintomas')

const poblacion = {
    "Hospital":83674,
    "Policlínico 1":128383,
    "Policlínico 2": 234226,
    "Policlínico 3": 20870
}


//get  =>[Get]/api/v1/matrix_reference
exports.febriles = catchAsyncErrors(async (req,res,next) =>{

    const fiebre = await Sintomas.findOne({
        name:"Fiebre"
    })

    const fecha = (new Date().getMonth()+1)+'/1/'+new Date().getFullYear();
    // const month = new Date();


    const all = await Epidemia.find({
        sintomas:fiebre._id,
        fecha_primera:{
            $gte:new Date(fecha)
        }
    }).populate('sintomas')


    return res.json({
        status:"success",
        fecha:new Date(fecha),
        data:all
    })
})


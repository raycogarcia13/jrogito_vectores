const catchAsyncErrors = require("./catchAsyncErrors")
const ErrorHandler = require("../utils/errorHandler");
const jwt = require('jsonwebtoken')
const db = require('../config/database')
const User = require('../components/models/User')
// checks if authenticated
exports.isAuthenticatedUser = catchAsyncErrors( async (req,res,next) => {
    let { token } = req.cookies;

    if(!token){
        token = req.headers.authorization

        if(!token)
            return next(new ErrorHandler('access.denied.token',401))
        
        token = token.replace(/^Bearer\s/, '');
    }
     
    
    const decoded = jwt.verify(token,process.env.JWT_SECRET)
    if(decoded){
        req.user = await User.findById(decoded.id)
        req.user.region = req.user.country?req.user.country.Region:3;
        req.token = token;

        next()
     }
    else
        return next(new ErrorHandler('access.denied.token',401))
})

// checks if role auth
exports.authorizeRole = (...roles) =>{
    return (req, res, next)=>{
        // && req.user.rol.rol != "manager bussines unit"
        if(!roles.includes(req.user.rol.rol) && req.user.rol.rol != "system admin" && req.user.rol.rol != "ceo")
            return next(new ErrorHandler(`Role (${req.user.rol.rol}) is not alowed to access to this resource`,403))
  
        next();
    }
}

exports.authorizePermission = (permission) =>{
    return (req, res, next)=>{
        if(req.user.rol.rol == "system admin" || req.user.rol.rol == "ceo")
            return next();


        const exist = req.user.Permissions.find(item=>{
            return item.name == permission
        })
        
        if(!exist)
            return next(new ErrorHandler(`The user is not alowed to access to this resource`,403))
        
        next();
    }
}

exports.authorizePermissions = (...permission) =>{
    return (req, res, next)=>{
        if(req.user.rol.rol == "system admin" || req.user.rol.rol == "ceo")
            return next();

        let exist = false;

        req.user.Permissions.forEach(item=>{
            if(permission.includes(item))
                exist = true;
        })
        
        
        if(!exist)
            return next(new ErrorHandler(`The user is not alowed to access to this resource`,403))
        
        next();
    }
}

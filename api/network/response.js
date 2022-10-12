 
exports.success = (res,status,data,message) =>{
    return res.json({
        status,
        message,
        data
    })
};
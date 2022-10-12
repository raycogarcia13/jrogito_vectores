const jwt = require('jsonwebtoken')
const axios = require('axios');

const getToken = ()=>{
    const token = jwt.sign({
        id:1
    },
    process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRESTIME
    });
    return token;
}

const PORT =  (process.env.NODE_ENV=='DEVELOPMENT')?process.env.PORT_DEV || 5001:process.env.PORT || 4001;

exports.requestApi = async (module_name, uri) =>{

    const uriU = `http://localhost:${PORT}/${module_name}/api/v1${uri}`;
    
    const token = getToken();

    try{
        let data = await axios.get(uriU,{
            headers: { Authorization: `Bearer ${token}` }
        });
        data = data.data;

        return data;
    }catch(err){
        console.log(err);
        return false
    }

}
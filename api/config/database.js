const mongoose = require('mongoose');

const uri = (process.env.NODE_ENV=='DEVELOPMENT')?process.env.DATABASE_DEV_URI_MACHINE||'mongodb://localhost:27017/salud_vector':process.env.DATABASE_URI_MACHINE||'mongodb://localhost:27017/salud_vector';
mongoose.connect(uri,{
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(db=> console.log(`Mongodb connected to ${uri}`))
.catch(err=>console.log(err))
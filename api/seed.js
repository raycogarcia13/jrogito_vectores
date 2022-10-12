const {uncaught,unhandled} = require('./utils/otherErrors')
uncaught();

require('dotenv').config({path:'config.env'});
const db = require('./config/database')

const {init} = require('./config/seeder');

init().then(r=>{
    console.log('Database filled!!')
    process.exit();
}).catch(errr=>{
    console.log('error')
    process.exit();
});

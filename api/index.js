const {uncaught,unhandled} = require('./utils/otherErrors')
uncaught();

require('dotenv').config({path:'./config/config.env'});
const db = require('./config/database')

const app = require('./app')

function main() {
    const server = app.listen(app.get('port'),()=>{
        console.log(`Techincal Design API running at ${app.get('port')} port in ${process.env.NODE_ENV||"develpment"} mode`)
    });
    unhandled(server)
}

main();

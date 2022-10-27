 

const express = require('express')
const app = express();
const cors = require('cors')
const bodyParser = require('body-parser');
const path = require("path")

const PORT =  process.env.PORT_MACHINE || 4000;

app.set('port',PORT)

const cookieParser = require('cookie-parser');
const corsOption = require('./config/cors');
app.use(cors(corsOption))
app.use(bodyParser.json({limit:'50mb'}));
app.use(cookieParser())

// ROUTES
app.use('/api/v1',require('./components/router/auth'))
// users
app.use('/api/v1',require('./components/router/users'))
// vectores
app.use('/api/v1',require('./components/router/vector'))
// epidemia
app.use('/api/v1',require('./components/router/epidemia'))
    
//statics files
// app.use(express.static(path.join(__dirname, "public")));

const errorMiddleware = require('./middlewares/errors')
app.use(errorMiddleware)


module.exports = app;
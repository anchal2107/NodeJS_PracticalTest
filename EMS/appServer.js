const constants = require('./constants')
//#region  "Mongodb url will be added here" 
 const mongoose = require('mongoose');
//const url =process.env.Mongodb_URL1+ process.env.MongoDb_DataBaseName1;
const url =constants.Mongodb_URL2+ constants.mongoDb_DataBaseName;
//const url =constants.mongoDb_URL2full;
console.log(`Connection of Mongoose before connect ${mongoose.connection.readyState}`);
console.log(` this is url of mongodb ${url}`);
mongoose.connect(url,{ useNewUrlParser: true, useUnifiedTopology: true });
console.log(`Connection of Mongoose ${mongoose.connection.readyState==2?'DBConnected':'Not Connected'}`);

// console.log(mongoose.connection.readyState);
// ready states being:

// 0: disconnected
// 1: connected
// 2: connecting
// 3: disconnecting

//#endregion


const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const app = express();

app.use(express.urlencoded());

// Parse JSON bodies (as sent by API clients)
app.use(express.json());
app.use(bodyParser.urlencoded({extended:false}));
 app.use(bodyParser.json());

const eventRoutes = require("./emsAPI/routers/events");
const userRoutes = require("./emsAPI/routers/users");

app.use('/api/event', eventRoutes);
app.use('/api/user', userRoutes);

//this will log 
app.use(morgan('dev'));


 

 app.use((req,res,next)=>{
 res.header('Access-Control-Allow-Origin','*');
 res.header('Access-Control-Allow-Headers','Origin, X-Requested-With, Content-Type, Accept, Authorization');
 if (req.method== 'OPTIONS')
 {
     res.header('Access=Control-Alow-Methods','PUT, POST, PATCH, DELETE, GET');
     return res.status(200).json({});
 }
 next();
 });

app.use(cors());


app.use((req, resp, next) => {
    const error = new Error("Not Found!");
    error.status=404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});


module.exports = app;
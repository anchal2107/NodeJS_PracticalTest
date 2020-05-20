//#region  "Mongodb url will be added here" 
// const mongoose = require('mongoose');
// //const url =process.env.Mongodb_URL1+ process.env.MongoDb_DataBaseName1;
// //const url =process.env.Mongodb_URL2+ process.env.MongoDb_DataBaseName2;
// const url ='test';
// mongoose.connect(url,{ useNewUrlParser: true });
//#endregion


const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const app = express();




const eventRoutes = require("./emsAPI/routers/events");
const userRoutes = require("./emsAPI/routers/users");
//this will log 
app.use(morgan('dev'));


 app.use(bodyParser.urlencoded({extended:false}));
 app.use(bodyParser.json());

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

app.use('/api/event', eventRoutes);
app.use('/api/user', userRoutes);

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
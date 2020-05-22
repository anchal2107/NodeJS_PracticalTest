const mongoose = require('mongoose');

// const userSchema = mongoose.Schema({
//     _id:mongoose.Schema.Types.ObjectId,
//     userId:Number,
//     userName:String,
//     password:String
// });

// here unique is not like validation here
// it just for optimation for indexing
// validatation is dont while before saving we .. validate.

const usersSchema = mongoose.Schema({
    //_id:mongoose.Schema.Types.ObjectId,
    userName:{type:String, required:true},
    //useremail will be verified with a parttern
    email:{
        type:String,
         required:true,
         unique:true,
        match:/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
    },
    password:{type:String, required:true},
    isResetPasswordApplied:{type:Boolean, default:false},
    otpForResetPassword:{type:String, default:'0000'}
});


module.exports=mongoose.model('Users',usersSchema);
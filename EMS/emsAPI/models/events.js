const mongoose = require('mongoose');

// const courseSchema = mongoose.Schema({
//     _id:mongoose.Schema.Types.ObjectId,
//     courseId:Number,
//     courseName:String,
//     price:Number
// });

//validation in mongodb while add
// like price is required
const eventsSchema = mongoose.Schema({
  //  _id:mongoose.Schema.Types.ObjectId,
    eventName:{type:String, required:true},
    userEmail:{type:String, required:true},
    details:{type:String},
    doc:{type:Date, default: Date.now},
    members:[{

        userEmail:{type:String},
        isActive:{type:Boolean, default: true},
        date: {
            type: Date,
            // `Date.now()` returns the current unix timestamp as a number
           default: Date.now},
            isAdmin:{type:Boolean, default: false},
    }],
    invited:[{
        userEmail:{type:String},
        date: {
            type: Date,
            // `Date.now()` returns the current unix timestamp as a number
            default: Date.now},
            isRejected:{type:Boolean, default: false},

    }],
});
module.exports=mongoose.model('Events',eventsSchema);
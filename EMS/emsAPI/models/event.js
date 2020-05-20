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
    _id:mongoose.Schema.Types.ObjectId,
    EventName:{type:String, required:true},
    UserEmail:{type:String, required:true},
    Desc:{type:String},
    Members:[{
        UserEmail:{type:String},
        Active:{type:Boolean, default: true},
        date: {
            type: Date,
            // `Date.now()` returns the current unix timestamp as a number
            default: Date.now}
    }],
    Invited:[{
        UserEmail:{type:String},
        date: {
            type: Date,
            // `Date.now()` returns the current unix timestamp as a number
            default: Date.now},
            isRejected:{type:Boolean, default: false},

    }],
});
module.exports=mongoose.model('Events',eventsSchema);
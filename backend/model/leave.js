const mongoose = require('mongoose');
const leave = new mongoose.Schema({
    email:{
    type:String,
    required:true
    },
    appointmentId:{
    type:String,
    unique:true,
    required:true
    },
    doctoremail:{
        type:String,
        required:true
    },
    college:{
        type:String,
    }
    ,
    startdate: {
        type: Date,
        required: true,
        
    },
    enddate: {
        type: Date,
        required: true
    },
    status:{
        type:String,
        required:true,
        default:"pending"
    }
    
},{timestamps:true});
const Leave = mongoose.model('leaves', leave);
module.exports= Leave
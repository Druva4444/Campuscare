const mongoose = require('mongoose');
const adminschema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password1: {
        type: String,
        required: true
    },
    otp:{
        type:String,
        required:false
    },
    college:{
        type:String,
        required:true
    },
    cretedon:{
        type:Date,
        required:true
    }
});
const Admin = mongoose.model('adminx', adminschema);
module.exports= Admin
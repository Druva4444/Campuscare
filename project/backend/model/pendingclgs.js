const mongoose = require('mongoose')
const clgschema = mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },
    fields:{
        type:Array,
        required:true
    },
    noOfStudents:{
        type:Number,
        required:true
    },
    noOfDoctors:{
        type:Number,
        required:true
    },
    domain:{
        type:String,
        required:true,
        unique:true
    },
    amount:{
        type:Number,
        required:true
    },
    plan:{
        type:Date,
        required:true
    },
   credentials:[{
    email:String,
    password:String,
   }]
})
const WaitingClgs = mongoose.model('WaitingColleges',clgschema)
module.exports = WaitingClgs
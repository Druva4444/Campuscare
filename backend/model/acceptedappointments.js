const mongoose = require('mongoose');
const appointmentschema = new mongoose.Schema({
    date:{
        type:Date,
        required:true
    },
    time:{
      type:String,
      required:true
    },
    description:{
        type:String,
        required:true
    },
    createdy:{
       type:String,
       required:true
    }, created:{
        type:Date,
        required:true
    },
    college:{
        type:String,
        required:true
    },
    acceptedby:{
        type:String,
        required:true
    }
})
appointmentschema.index({acceptedby:1,date:1});
const accappointment = mongoose.model('accappointment',appointmentschema)
module.exports = accappointment
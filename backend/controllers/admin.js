const Doctor = require('../model/doctor');
const express= require('express');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const mongoose =  require('mongoose');
const Users = require('../model/user')
const Collage = require('../model/college')
const reportdb = require('../model/report')
const accappointment = require('../model/acceptedappointments')
const rejappointment = require('../model/rejectedappointments')
const Admins = require('../model/admin')
const reports = require('../model/report');
const User = require('../model/user');
async function getappsclg(req,res){
    try{
        const {college} = req.body;
        const apps = await accappointment.find({college:college})
        return res.status(200).json({apps:apps})
    }
    catch(error){
        return res.status(500).json({error})
    }
}
async function handleadminlogin(req, res) {
    const { email, password1, checkbox } = req.body;

    const admin = await Admins.findOne({ email, password1 });
    if (!admin) {
        return res.status(200).json({ message: 'incorrect details' });
    }

    // Prepare cookie data to be sent to frontend
    const userDetails = {
        gmail: admin.email,
        role: 'admin',
        college: admin.college
    };

    let token = null;
    if (checkbox) {
        token = jwt.sign({
            gmail: admin.email,
            password: admin.password1,
            college: admin.college
        }, "druva123", { expiresIn: "4d" });
    }

    // Send the cookie values to frontend to set manually
    return res.status(200).json({
        message: "Login Succesful",
        userdetails: userDetails,
        token: token // Only present if rememberMe was checked
    });
}

async function adminhome(req,res){
    console.log(req.body)
    const {gmail,college} = req.body
    const user =await Users.find({college:college})
    const doctors =await Doctor.find({college:college})
    const upcomingapp = await accappointment.find({date:{$gte:new Date()},college:college})
    const completedapp = await accappointment.find({date:{$lte:new Date()},college:college})
    console.log(user)
    console.log(doctors)
    patients=user
    let accapp=[],upcomiapp=[],latestdates=[]
    for(let i=0;i<patients.length;i++){
    let x = await accappointment.find({createdy:patients[i].gmail,date:{$lt:new Date()}}).sort({date:-1});
    let y = await accappointment.find({createdy:patients[i].gmail,date:{$gte:new Date()}});
    latestdates.push(x.length > 0 && x[0].date ? x[0].date : "NA");
  accapp.push(x)
 upcomiapp.push(y);
    }
   
        let accapp1=[],upcomiapp1=[],latestdates1=[]
        for(let i=0;i<doctors.length;i++){
        let x = await accappointment.find({acceptedby:doctors[i].gmail,date:{$lt:new Date()}}).sort({date:-1});
        let y = await accappointment.find({acceptedby:doctors[i].gmail,date:{$gte:new Date()}});
        accapp1.push(x)
        upcomiapp1.push(y)
        latestdates1.push(x.length > 0 && x[0].date ? x[0].date : "NA")
        }
        console.log(accapp1)
        console.log(upcomiapp1)
        console.log(latestdates)
    console.log(accapp)
    console.log(upcomiapp)
        const report = await reports.find({college:college})
        console.log(report)
    res.status(200).json({students:user,doctor:doctors,upcomingapp,completedapp,accapp,upcomiapp,accapp1,upcomiapp1,report})
}
async function deletepd(req,res){
    const {id,role} = req.body
    if(role=='doctor'){
        await Doctor.findByIdAndDelete(id);
        return res.status(200).json({msg:'docotor deleted succesfully'})
    }
    else if(role=='patient'){
        await User.findByIdAndDelete(id);
        return res.status(200).json({msg:'student deleted succesfully'})
    }
}

module.exports={handleadminlogin,adminhome,deletepd,getappsclg}
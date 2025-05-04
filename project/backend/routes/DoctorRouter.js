const express = require('express');
const DoctorRouter = express.Router();
const checkAuth = require('../middleware/Doctor.js');
const {getcolleges,handlelogin,givehomedet,deleteapp,getpatients,addreport,sendotp,handleforget,resetp,getslotsdoc,adddoc,modifyleaves} = require('../controllers/doctor')
const {getstudents,dcreateMessage,dgetMessages,getdoctors,screateMessage,sgetMessages,getstuobj,getdocobj} = require('../controllers/chat')
DoctorRouter.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} - ${req.url}`);
    next();
  });
  
DoctorRouter.get('/getcolleges' , getcolleges);
DoctorRouter.post('/dlogin',handlelogin)
DoctorRouter.post('/gethome',givehomedet)
DoctorRouter.post('/dltapp',deleteapp)  
DoctorRouter.post('/getpatients',getpatients)
DoctorRouter.post('/postreport',addreport)
DoctorRouter.post('/sendotp',sendotp)
DoctorRouter.post('/handleforget',handleforget)
DoctorRouter.post('/resetpassword',resetp)
DoctorRouter.post('/getslotsdoc',getslotsdoc)
DoctorRouter.post('/adddoc',adddoc)
DoctorRouter.post('/modifyleaves' ,  modifyleaves);
DoctorRouter.post('/getstudents', getstudents);
DoctorRouter.post('/dcreateMessage', dcreateMessage);
DoctorRouter.post('/dgetMessages', dgetMessages);
DoctorRouter.post('/getdoctors', getdoctors);
DoctorRouter.post('/screateMessage', screateMessage);
DoctorRouter.post('/sgetMessages', sgetMessages);
DoctorRouter.post('/getstuobj', getstuobj);
DoctorRouter.post('/getdocobj', getdocobj);
module.exports = DoctorRouter;
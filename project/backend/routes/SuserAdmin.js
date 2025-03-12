const express = require('express');
const SuserAdmin = express.Router();
const {postloginpage,handlelogout,gethome,getadminpage,deleteadmins,getcollegepage,handledeletecollege,getcolleges1,Addadmin,getGmail, fetchWaitingClgs, acceptClgReq, susersendotp, suserresetp, suserhandleforget,deleteclgreq} = require('../controllers/suser');
SuserAdmin.get('/fetchcolleges' , getcolleges1);
SuserAdmin.post('/getsuserhome' , postloginpage);
SuserAdmin.post('/logoutsuser' , handlelogout);
SuserAdmin.get('/gethomedata' , gethome);
SuserAdmin.get('/waitingclgs' , fetchWaitingClgs)
SuserAdmin.get('/getadmin' , getadminpage);
SuserAdmin.post('/deleteadmins' , deleteadmins );
SuserAdmin.get('/getcollege' , getcollegepage);
SuserAdmin.post('/deletecollege' ,handledeletecollege)
SuserAdmin.post('/Addadmin' , Addadmin)
SuserAdmin.get('/getGmail',getGmail);
SuserAdmin.post('/acceptclgreq/:id/:email',acceptClgReq);
SuserAdmin.post('/deleteclgreq/:id/:email',deleteclgreq);
SuserAdmin.post('/superuser/handleforget',suserhandleforget)
SuserAdmin.post('/superuser/resetpassword',suserresetp)
SuserAdmin.post('/superuser/sendotp',susersendotp)
module.exports = SuserAdmin;
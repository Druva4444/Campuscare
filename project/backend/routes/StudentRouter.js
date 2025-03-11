const express = require('express');
const StudentRouter = express.Router();
const {handleloginS,handlestudenthome,deletebooking,handleverify,sendotps,resetps,handle_appointments,getslots,bookslot,addstu ,fetchcolleges1,Addstudent,applyleave,getleaves,getleaves2} = require('../controllers/Student')
StudentRouter.post('/slogin',handleloginS)
StudentRouter.post('/getStuhome',handlestudenthome)
StudentRouter.post('/deletebooking',deletebooking)
StudentRouter.post('/resetpasswords',resetps)
StudentRouter.post('/sendotps',sendotps)
StudentRouter.post('/handleforgetstu',handleverify)
StudentRouter.post('/getdoc',handle_appointments)
StudentRouter.post('/getslots',getslots)
StudentRouter.post('/bookslot',bookslot)
StudentRouter.post('/addstu',addstu)
StudentRouter.post('/applyleave' ,  applyleave);
StudentRouter.get('/leaves' , getleaves);
StudentRouter.get('/leaves2' , getleaves2);
StudentRouter.get('/fetchcolleges1' , fetchcolleges1)
StudentRouter.post('/Addstudent' , Addstudent);
module.exports = StudentRouter;
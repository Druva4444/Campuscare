const express = require('express');
const AdminRouter = express.Router(); 
const {handleadminlogin,adminhome,deletepd} = require('../controllers/admin')
AdminRouter.post('/adminlogin',handleadminlogin)
AdminRouter.post('/getadminhome',adminhome)
AdminRouter.post('/deletepd',deletepd)

module.exports = AdminRouter;
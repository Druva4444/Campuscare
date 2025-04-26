const express = require('express');
const AdminRouter = express.Router(); 
const {handleadminlogin,adminhome,deletepd} = require('../controllers/admin')
AdminRouter.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} - ${req.url}`);
    next();
  });
AdminRouter.post('/adminlogin',handleadminlogin)
AdminRouter.post('/getadminhome',adminhome)
AdminRouter.post('/deletepd',deletepd)

module.exports = AdminRouter;
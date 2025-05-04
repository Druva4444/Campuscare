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

const { createClient } = require('redis');

const {
  getcolleges,
  handlelogin,
  givehomedet,
  deleteapp,
  getpatients,
  addreport,
  sendotp,
  handleforget,
  resetp,
  getslotsdoc,
  adddoc,
  modifyleaves
} = require('../controllers/doctor');

DoctorRouter.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} - ${req.url}`);
  next();
});

/**
 * @swagger
 * /doctor/getcolleges:
 *   get:
 *     summary: Get all colleges
 *     tags: [Doctor]
 *     responses:
 *       200:
 *         description: List of colleges
 */
DoctorRouter.get('/getcolleges', getcolleges);

/**
 * @swagger
 * /doctor/dlogin:
 *   post:
 *     summary: Doctor login
 *     tags: [Doctor]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login success or failure
 */
DoctorRouter.post('/dlogin', handlelogin);

/**
 * @swagger
 * /doctor/gethome:
 *   post:
 *     summary: Get doctor's home details
 *     tags: [Doctor]
 *     responses:
 *       200:
 *         description: Home data
 */
DoctorRouter.post('/gethome', givehomedet);

/**
 * @swagger
 * /doctor/dltapp:
 *   post:
 *     summary: Delete appointment
 *     tags: [Doctor]
 *     responses:
 *       200:
 *         description: Appointment deleted
 */
DoctorRouter.post('/dltapp', deleteapp);

/**
 * @swagger
 * /doctor/getpatients:
 *   post:
 *     summary: Get list of patients
 *     tags: [Doctor]
 *     responses:
 *       200:
 *         description: List of patients
 */
DoctorRouter.post('/getpatients', getpatients);

/**
 * @swagger
 * /doctor/postreport:
 *   post:
 *     summary: Add report for a patient
 *     tags: [Doctor]
 *     responses:
 *       200:
 *         description: Report added
 */
DoctorRouter.post('/postreport', addreport);

/**
 * @swagger
 * /doctor/sendotp:
 *   post:
 *     summary: Send OTP to doctor's email
 *     tags: [Doctor]
 *     responses:
 *       200:
 *         description: OTP sent
 */
DoctorRouter.post('/sendotp', sendotp);

/**
 * @swagger
 * /doctor/handleforget:
 *   post:
 *     summary: Handle forgot password for doctor
 *     tags: [Doctor]
 *     responses:
 *       200:
 *         description: Forgot password handled
 */
DoctorRouter.post('/handleforget', handleforget);

/**
 * @swagger
 * /doctor/resetpassword:
 *   post:
 *     summary: Reset password for doctor
 *     tags: [Doctor]
 *     responses:
 *       200:
 *         description: Password reset successful
 */
DoctorRouter.post('/resetpassword', resetp);

/**
 * @swagger
 * /doctor/getslotsdoc:
 *   post:
 *     summary: Get doctor's available slots
 *     tags: [Doctor]
 *     responses:
 *       200:
 *         description: Slots fetched
 */
DoctorRouter.post('/getslotsdoc', getslotsdoc);

/**
 * @swagger
 * /doctor/adddoc:
 *   post:
 *     summary: Add a new doctor
 *     tags: [Doctor]
 *     responses:
 *       200:
 *         description: Doctor added
 */
DoctorRouter.post('/adddoc', adddoc);

/**
 * @swagger
 * /doctor/modifyleaves:
 *   post:
 *     summary: Modify doctor's leave details
 *     tags: [Doctor]
 *     responses:
 *       200:
 *         description: Leaves updated
 */
DoctorRouter.post('/modifyleaves', modifyleaves);

module.exports = DoctorRouter

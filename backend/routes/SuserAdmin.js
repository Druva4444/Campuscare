const express = require('express');
const SuserAdmin = express.Router();

const {
  postloginpage, handlelogout, gethome, getadminpage, deleteadmins,
  getcollegepage, handledeletecollege, getcolleges1, Addadmin, getGmail,
  fetchWaitingClgs, acceptClgReq, susersendotp, suserresetp, suserhandleforget,
  deleteclgreq, getstudents, searchstudent, getappointments,getapp
} = require('../controllers/suser');

SuserAdmin.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} - ${req.url}`);
  next();
});

/**
 * @swagger
 * /fetchcolleges:
 *   get:
 *     summary: Fetch all colleges
 *     tags: [SuperUser]
 *     responses:
 *       200:
 *         description: List of colleges
 */
SuserAdmin.get('/fetchcolleges', getcolleges1);

/**
 * @swagger
 * /getsuserhome:
 *   post:
 *     summary: Super user login
 *     tags: [SuperUser]
 *     responses:
 *       200:
 *         description: Super user home data
 */
SuserAdmin.post('/getsuserhome', postloginpage);

/**
 * @swagger
 * /logoutsuser:
 *   post:
 *     summary: Super user logout
 *     tags: [SuperUser]
 *     responses:
 *       200:
 *         description: Logged out successfully
 */
SuserAdmin.post('/logoutsuser', handlelogout);

/**
 * @swagger
 * /gethomedata:
 *   get:
 *     summary: Get super user home data
 *     tags: [SuperUser]
 *     responses:
 *       200:
 *         description: Home data
 */
SuserAdmin.get('/gethomedata', gethome);

/**
 * @swagger
 * /waitingclgs:
 *   get:
 *     summary: Fetch waiting colleges
 *     tags: [SuperUser]
 *     responses:
 *       200:
 *         description: List of pending colleges
 */
SuserAdmin.get('/waitingclgs', fetchWaitingClgs);

/**
 * @swagger
 * /getadmin:
 *   get:
 *     summary: Get list of admins
 *     tags: [SuperUser]
 *     responses:
 *       200:
 *         description: List of admins
 */
SuserAdmin.get('/getadmin', getadminpage);

/**
 * @swagger
 * /deleteadmins:
 *   post:
 *     summary: Delete an admin
 *     tags: [SuperUser]
 *     responses:
 *       200:
 *         description: Admin deleted
 */
SuserAdmin.post('/deleteadmins', deleteadmins);

/**
 * @swagger
 * /getcollege:
 *   get:
 *     summary: Get college details
 *     tags: [SuperUser]
 *     responses:
 *       200:
 *         description: College details
 */
SuserAdmin.get('/getcollege', getcollegepage);

/**
 * @swagger
 * /deletecollege:
 *   post:
 *     summary: Delete a college
 *     tags: [SuperUser]
 *     responses:
 *       200:
 *         description: College deleted
 */
SuserAdmin.post('/deletecollege', handledeletecollege);

/**
 * @swagger
 * /Addadmin:
 *   post:
 *     summary: Add a new admin
 *     tags: [SuperUser]
 *     responses:
 *       201:
 *         description: Admin added
 */
SuserAdmin.post('/Addadmin', Addadmin);

/**
 * @swagger
 * /getGmail:
 *   get:
 *     summary: Get Gmail credentials
 *     tags: [SuperUser]
 *     responses:
 *       200:
 *         description: Gmail info
 */
SuserAdmin.get('/getGmail', getGmail);

/**
 * @swagger
 * /acceptclgreq/{id}/{email}/{password}/{name}:
 *   post:
 *     summary: Accept a college request
 *     tags: [SuperUser]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: password
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Request accepted
 */
SuserAdmin.post('/acceptclgreq/:id/:email/:password/:name', acceptClgReq);

/**
 * @swagger
 * /deleteclgreq/{id}/{email}:
 *   post:
 *     summary: Delete a college request
 *     tags: [SuperUser]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Request deleted
 */
SuserAdmin.post('/deleteclgreq/:id/:email', deleteclgreq);

/**
 * @swagger
 * /superuser/handleforget:
 *   post:
 *     summary: Handle forgot password
 *     tags: [SuperUser]
 *     responses:
 *       200:
 *         description: OTP sent
 */
SuserAdmin.post('/superuser/handleforget', suserhandleforget);

/**
 * @swagger
 * /superuser/resetpassword:
 *   post:
 *     summary: Reset password
 *     tags: [SuperUser]
 *     responses:
 *       200:
 *         description: Password reset
 */
SuserAdmin.post('/superuser/resetpassword', suserresetp);

/**
 * @swagger
 * /superuser/sendotp:
 *   post:
 *     summary: Send OTP for verification
 *     tags: [SuperUser]
 *     responses:
 *       200:
 *         description: OTP sent
 */
SuserAdmin.post('/superuser/sendotp', susersendotp);

/**
 * @swagger
 * /getstudents:
 *   get:
 *     summary: Get all students
 *     tags: [SuperUser]
 *     responses:
 *       200:
 *         description: List of students
 */
SuserAdmin.get('/getstudents', getstudents);

/**
 * @swagger
 * /searchstudent:
 *   get:
 *     summary: Search for a student
 *     tags: [SuperUser]
 *     responses:
 *       200:
 *         description: Search results
 */
SuserAdmin.get('/searchstudent', searchstudent);
SuserAdmin.get('/getapp',getapp)
/**
 * @swagger
 * /getappointments:
 *   get:
 *     summary: Get all appointments
 *     tags: [SuperUser]
 *     responses:
 *       200:
 *         description: List of appointments
 */
SuserAdmin.get('/getappointments', getappointments);

module.exports = SuserAdmin;

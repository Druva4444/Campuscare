const express = require('express');
const checkAuth = require('../middleware/Student.js');
const StudentRouter = express.Router();

const {
  handleloginS,
  handlestudenthome,
  deletebooking,
  handleverify,
  sendotps,
  resetps,
  handle_appointments,
  getslots,
  bookslot,
  addstu,
  fetchcolleges1,
  Addstudent,
  applyleave,
  getleaves,
  getleaves2
} = require('../controllers/Student');

// Logging middleware
StudentRouter.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} - ${req.url}`);
  next();
});

/**
 * @swagger
 * /student/slogin:
 *   post:
 *     summary: Student login
 *     tags: [Student]
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
 *         description: Login result
 */
StudentRouter.post('/slogin', handleloginS);

/**
 * @swagger
 * /student/getStuhome:
 *   post:
 *     summary: Get student home details
 *     tags: [Student]
 *     responses:
 *       200:
 *         description: Student home data
 */
StudentRouter.post('/getStuhome', handlestudenthome);

/**
 * @swagger
 * /student/deletebooking:
 *   post:
 *     summary: Delete student's booking
 *     tags: [Student]
 *     responses:
 *       200:
 *         description: Booking deleted
 */
StudentRouter.post('/deletebooking', deletebooking);

/**
 * @swagger
 * /student/resetpasswords:
 *   post:
 *     summary: Reset student's password
 *     tags: [Student]
 *     responses:
 *       200:
 *         description: Password reset
 */
StudentRouter.post('/resetpasswords', resetps);

/**
 * @swagger
 * /student/sendotps:
 *   post:
 *     summary: Send OTP to student email
 *     tags: [Student]
 *     responses:
 *       200:
 *         description: OTP sent
 */
StudentRouter.post('/sendotps', sendotps);

/**
 * @swagger
 * /student/handleforgetstu:
 *   post:
 *     summary: Handle forgot password for student
 *     tags: [Student]
 *     responses:
 *       200:
 *         description: Password reset step 1
 */
StudentRouter.post('/handleforgetstu', handleverify);

/**
 * @swagger
 * /student/getdoc:
 *   post:
 *     summary: Get available doctor appointments
 *     tags: [Student]
 *     responses:
 *       200:
 *         description: List of doctors
 */
StudentRouter.post('/getdoc', handle_appointments);

/**
 * @swagger
 * /student/getslots:
 *   post:
 *     summary: Get available slots
 *     tags: [Student]
 *     responses:
 *       200:
 *         description: Available slots
 */
StudentRouter.post('/getslots', getslots);

/**
 * @swagger
 * /student/bookslot:
 *   post:
 *     summary: Book a slot
 *     tags: [Student]
 *     responses:
 *       200:
 *         description: Slot booked
 */
StudentRouter.post('/bookslot', bookslot);

/**
 * @swagger
 * /student/addstu:
 *   post:
 *     summary: Add student info
 *     tags: [Student]
 *     responses:
 *       200:
 *         description: Student added
 */
StudentRouter.post('/addstu', addstu);

/**
 * @swagger
 * /student/applyleave:
 *   post:
 *     summary: Apply for leave
 *     tags: [Student]
 *     responses:
 *       200:
 *         description: Leave applied
 */
StudentRouter.post('/applyleave', applyleave);

/**
 * @swagger
 * /student/leaves:
 *   get:
 *     summary: Get applied leaves
 *     tags: [Student]
 *     responses:
 *       200:
 *         description: List of leaves
 */
StudentRouter.get('/leaves', getleaves);

/**
 * @swagger
 * /student/leaves2:
 *   get:
 *     summary: Get processed leave status
 *     tags: [Student]
 *     responses:
 *       200:
 *         description: Leave status
 */
StudentRouter.get('/leaves2', getleaves2);

/**
 * @swagger
 * /student/fetchcolleges1:
 *   get:
 *     summary: Fetch all colleges (for students)
 *     tags: [Student]
 *     responses:
 *       200:
 *         description: List of colleges
 */
StudentRouter.get('/fetchcolleges1', fetchcolleges1);

/**
 * @swagger
 * /student/Addstudent:
 *   post:
 *     summary: Register a new student
 *     tags: [Student]
 *     responses:
 *       200:
 *         description: Student registration success
 */
StudentRouter.post('/Addstudent', Addstudent);

module.exports = StudentRouter;

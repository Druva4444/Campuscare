const express = require('express');
const AdminRouter = express.Router(); 
const { handleadminlogin, adminhome, deletepd,getappsclg } = require('../controllers/admin');

// Middleware to log incoming requests
AdminRouter.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} - ${req.url}`);
    next();
});
AdminRouter.use('/getappsclg',getappsclg)
/**
 * @swagger
 * /adminlogin:
 *   post:
 *     summary: Admin login
 *     tags: [Admin]
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
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Successful login
 *       401:
 *         description: Invalid credentials
 */
AdminRouter.post('/adminlogin', handleadminlogin);

/**
 * @swagger
 * /getadminhome:
 *   post:
 *     summary: Get admin dashboard data
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Admin dashboard info
 */
AdminRouter.post('/getadminhome', adminhome);

/**
 * @swagger
 * /deletepd:
 *   post:
 *     summary: Delete a doctor or student profile
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [doctor, student]
 *             required:
 *               - userId
 *               - role
 *     responses:
 *       200:
 *         description: Profile deleted
 *       404:
 *         description: Profile not found
 */
AdminRouter.post('/deletepd', deletepd);

module.exports = AdminRouter;

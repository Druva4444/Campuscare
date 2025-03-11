const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const Student = require('../model/user')
const Doctors = require('../model/doctor')
const Collage = require('../model/college')
const mongoose = require('mongoose')










const upload = multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, '../uploads'); // Use a relative path
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir);
      },
      filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
      },
    }),
    fileFilter: (req, file, cb) => {
      if (file.mimetype === 'application/json') {
        cb(null, true);
      } else {
        cb(new Error('Only JSON files are allowed!'), false);
      }
    },
  });
  
  router.post('/studentupload', upload.single('json1'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).send({ message: 'No file uploaded!' });
      }
  
      const {college} = req.body
      const filePath = req.file.path;
      console.log(college)
      const fileData = fs.readFileSync(filePath, 'utf-8');
      const students = JSON.parse(fileData);

      const clg = await Collage.findOne({name:college})
     const studentsdb = await Student.find({})
      console.log(clg)
      console.log(clg.noOfStudents)
      for (const student of students) {
        try {
            const currentusers = await Student.find({})
            if(currentusers.length>=clg.noOfStudents){
                return res.status(200).json({message:`maximumm limit reached added only first ${clg.noOfStudents-studentsdb.length} `})
            }
            if(student.college==college){
              await Student.create(student); 
            }
            else{
              console.log('colleges doesnot matched')
            }
         
        } catch (error) {
          console.error(`Failed to insert student: ${JSON.stringify(student)}`, error);
         
        }
      }
      res.status(200).send({ message: 'Students added successfully!' });
      fs.unlinkSync(filePath);
    } catch (error) {
      console.error('Error processing file:', error);
      res.status(500).send({ message: 'Internal Server Error', error });
    }
  });
  router.post('/doctorupload', upload.single('json1'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).send({ message: 'No file uploaded!' });
      }
  
      const {college} = req.body
      const filePath = req.file.path;
      console.log(college)
      const fileData = fs.readFileSync(filePath, 'utf-8');
      const students = JSON.parse(fileData);

      const clg = await Collage.findOne({name:college})
     const studentsdb = await Doctors.find({})
      console.log(clg)
      console.log(clg.noOfDoctors)
      for (const student of students) {
        try {
            const currentusers = await Doctors.find({})
            if(currentusers.length>=clg.noOfDoctors){
                return res.status(200).json({message:`maximumm limit reached added only first ${clg.noOfStudents-studentsdb.length} `})
            }
            if(student.college==college){
              await Doctors.create(student); 
              console.log('docotr created ')
            }
            else{
              console.log('colleges doesnot matched')
            }
         
        } catch (error) {
          console.error(`Failed to insert student: ${JSON.stringify(student)}`, error);
         
        }
      }
      res.status(200).send({ message: 'doctors  added successfully!' });
      fs.unlinkSync(filePath);
    } catch (error) {
      console.error('Error processing file:', error);
      res.status(500).send({ message: 'Internal Server Error', error });
    }
  });
module.exports=router





const WaitingClgs = require('../model/pendingclgs'); // Adjust the path as needed



  
  router.post('/studentupload', upload.single('json1'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).send({ message: 'No file uploaded!' });
      }
  
      const {college} = req.body
      const filePath = req.file.path;
      console.log(college)
      const fileData = fs.readFileSync(filePath, 'utf-8');
      const students = JSON.parse(fileData);

      const clg = await Collage.findOne({name:college})
     const studentsdb = await Student.find({})
      console.log(clg)
      console.log(clg.noOfStudents)
      for (const student of students) {
        try {
            const currentusers = await Student.find({})
            if(currentusers.length>=clg.noOfStudents){
                return res.status(200).json({message:`maximumm limit reached added only first ${clg.noOfStudents-studentsdb.length} `})
            }
            if(student.college==college){
              await Student.create(student); 
            }
            else{
              console.log('colleges doesnot matched')
            }
         
        } catch (error) {
          console.error(`Failed to insert student: ${JSON.stringify(student)}`, error);
         
        }
      }
      res.status(200).send({ message: 'Students added successfully!' });
      fs.unlinkSync(filePath);
    } catch (error) {
      console.error('Error processing file:', error);
      res.status(500).send({ message: 'Internal Server Error', error });
    }
  });
  router.post('/doctorupload', upload.single('json1'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).send({ message: 'No file uploaded!' });
      }
  
      const {college} = req.body
      const filePath = req.file.path;
      console.log(college)
      const fileData = fs.readFileSync(filePath, 'utf-8');
      const students = JSON.parse(fileData);

      const clg = await Collage.findOne({name:college})
     const studentsdb = await Doctors.find({})
      console.log(clg)
      console.log(clg.noOfDoctors)
      for (const student of students) {
        try {
            const currentusers = await Doctors.find({})
            if(currentusers.length>=clg.noOfDoctors){
                return res.status(200).json({message:`maximumm limit reached added only first ${clg.noOfStudents-studentsdb.length} `})
            }
            if(student.college==college){
              await Doctors.create(student); 
              console.log('docotr created ')
            }
            else{
              console.log('colleges doesnot matched')
            }
         
        } catch (error) {
          console.error(`Failed to insert student: ${JSON.stringify(student)}`, error);
         
        }
      }
      res.status(200).send({ message: 'doctors  added successfully!' });
      fs.unlinkSync(filePath);
    } catch (error) {
      console.error('Error processing file:', error);
      res.status(500).send({ message: 'Internal Server Error', error });
    }
  });
  router.post('/addnewclg', async function (req, res) {
          try {
              const { collegename, students, doctors, domain, specialists, admin, plan } = req.body;
              if (!collegename || !students || !doctors || !domain || !specialists || !admin || plan === undefined) {
                  return res.status(400).json({ message: 'All fields are required.' });
              }
              const existingCollege = await WaitingClgs.findOne({
                  $or: [{ name: collegename }, { domain: domain }],
              });
              if (existingCollege) {
                  return res.status(409).json({ message: 'College name or domain already exists.' });
              }
              const currentDate = new Date();
              currentDate.setMonth(currentDate.getMonth() + plan);
              let amount = 0
              switch (plan) {
                case 3:
                    amount = 200*students+ 400*doctors
                  break;
                case 6:
                  amount = 2*(180*students+ 360*doctors)
                  break;
                case 12:
                  amount=4*(150*students + 320*doctors)
                  break;
                default:
                  break;
              }
              const newCollege = new WaitingClgs({
                  name: collegename,
                  fields: specialists,
                  noOfStudents: students,
                  noOfDoctors: doctors,
                  domain: domain,
                  amount: amount, // Default value, update if needed
                  plan: currentDate, // Set plan to the current date + plan months
                  credentials: [
                      {
                          email: admin.email || '', // Default to empty if not provided
                          password: admin.password,
                      },
                  ],
              });
              await newCollege.save();
              res.status(201).json({ message: 'College added successfully.', college: newCollege });
          } catch (error) {
              console.error('Error while adding new college:', error);
              res.status(500).json({ message: 'Server error. Please try again later.' });
          }
      });

      router.post('/addnewclg', async function (req, res) {

        try {
          
            const { collegename, students, doctors, domain, specialists, admin, plan } = req.body;
            
            if (!collegename || !students || !doctors || !domain || !specialists || !admin || plan === undefined) {
                return res.status(400).json({ message: 'All fields are required.' });
            }
            const existingCollege = await WaitingClgs.findOne({
                $or: [{ name: collegename }, { domain: domain }],
            });
            if (existingCollege) {
                return res.status(409).json({ message: 'College name or domain already exists.' });
            }
            const currentDate = new Date();
            currentDate.setMonth(currentDate.getMonth() + plan);
            let amount = 0
            switch (plan) {
              case 3:
                  amount = 200*students+ 400*doctors
                break;
              case 6:
                amount = 2*(180*students+ 360*doctors)
                break;
              case 12:
                amount=4*(150*students + 320*doctors)
                break;
              default:
                break;
            }
            const newCollege = new WaitingClgs({
                name: collegename,
                fields: specialists,
                noOfStudents: students,
                noOfDoctors: doctors,
                domain: domain,
                amount: amount, 
                plan: currentDate, 
                credentials: [
                    {
                        email: admin.email, 
                        password: admin.password,
                    },
                ],
            });
            await newCollege.save();
            res.status(201).json({ message: 'College added successfully.', college: newCollege });
        } catch (error) {
            console.error('Error while adding new college:', error);
            res.status(500).json({ message: 'Server error. Please try again later.' });
        }
    });

module.exports=router
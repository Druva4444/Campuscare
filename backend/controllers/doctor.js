const Doctor = require('../model/doctor');
const express= require('express');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const mongoose =  require('mongoose');
const Leave = require('../model/leave')
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const Collage = require('../model/college')
const reportdb = require('../model/report')
const accappointment = require('../model/acceptedappointments')
const rejappointment = require('../model/rejectedappointments')
const {createClient} = require('redis');

const redisClient = createClient({
    username: 'default',
    password: 'NPk03ZQIVWR1Tqs4Jv8HdNhuIpFi4qfa',
    socket: {
        host: 'redis-16200.c261.us-east-1-4.ec2.redns.redis-cloud.com',
        port: 16200
    }
});

redisClient.on('error', err => console.log('Redis Client Error', err));
async function connectRedis() {
    try {
        await redisClient.connect();
        console.log('Connected to Redis');
    } catch (error) {
        console.error('Error connecting to Redis:', error);
    }
}
connectRedis();

async function getcolleges(req, res) {
    try {
      const keys = await redisClient.keys('college:*');
      let colleges = [];
      if (keys.length > 0) {
        const collegesData = await redisClient.mGet(keys);
        colleges = collegesData.map(data => JSON.parse(data));
        console.log('Colleges fetched from Redis');
      }
      if (colleges.length > 0) {
        return res.status(200).json(colleges);
      }
      colleges = await Collage.find();
      console.log('Colleges fetched from DB');
      if (!colleges || colleges.length === 0) {
        return res.status(404).json({ message: "No colleges found" });
      }
      const pipeline = redisClient.multi();
      colleges.forEach(college => {
        pipeline.set(`college:${college.name}`, JSON.stringify(college));
      });
      await pipeline.exec();
      console.log('Colleges cached in Redis');
      return res.status(200).json(colleges);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
  


  async function handlelogin(req, res) {
    try {
        const { email, password1, college, checkbox } = req.body;
        console.log(req.body);

        const specificUser = await Doctor.findOne({ gmail: email, password: password1, college });
        if (!specificUser) {
            console.log("No user found");
            return res.status(200).json({ message: "Invalid credentials. Please try again." });
        }

        // If "Remember Me" is checked, generate a JWT token
        let token = null;
        if (checkbox) {
            token = jwt.sign(
                {
                    gmail: specificUser.gmail,
                    password: specificUser.password,
                    clg: specificUser.college,
                },
                "druva123",
                { expiresIn: "4d" }
            );
        }

        const userdetails = {
            gmail: specificUser.gmail,
            college: specificUser.college,
        };

        // Fetch today's appointments (optional logging)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayAppointments = await accappointment.find({
            date: {
                $gte: today,
                $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
            },
        }).sort({ date: 1, time: 1 });

        console.log("Today's Appointments:", todayAppointments);

        // Send data to frontend (frontend will set cookies)
        return res.status(200).json({
            message: "Login Succesful",
            token: token || null,
            userdetails
        });

    } catch (error) {
        console.error("Error processing doctor login:", error);
        return res.status(500).send("Internal Server Error");
    }
}

async function givehomedet(req, res) {
    const { email } = req.body;
    console.log(email);
  
    try {
      const keys = await redisClient.keys('appointment:*');
      let appointments = [];
  
      if (keys.length > 0) {
        const appointmentsData = await redisClient.mGet(keys);
        appointments = appointmentsData
          .map(data => JSON.parse(data))
          .filter(app => app.acceptedby === email); 
      }
  
      let total = [];
      let upcomi = [];
      
      if (appointments.length > 0) {
        console.log("Cache hit for appointments");
  
        const now = new Date();
        total = appointments.filter(app => new Date(app.date) <= now); // Past and current appointments
        upcomi = appointments.filter(app => new Date(app.date) > now);  // Future appointments
  
        upcomi.sort((a, b) => new Date(a.date) - new Date(b.date)); // Sort total by date
        
        console.log(upcomi)
        return res.json({ total, upcomi });
      }
  
      // Step 2: Cache miss - fetch from DB if no data found in Redis
      const now = new Date();
      total = await accappointment.find({ acceptedby: email, date: { $lte: now } }).sort({ date: 1 });
      upcomi = await accappointment.find({ acceptedby: email, date: { $gte: now } }).sort({ date: 1 });
  
      // Step 3: Cache new appointments to Redis
      const pipeline = redisClient.multi();
      total.concat(upcomi).forEach(appointment => {
        pipeline.set(`appointment:${appointment._id}`, JSON.stringify(appointment));
      });
      await pipeline.exec();
      console.log("Appointments cached in Redis");
  
      return res.json({ total, upcomi });
  
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
  
async function deleteapp(req, res) {
    const { id, acceptedby } = req.body;

    try {
        // Find the appointment by ID
        console.log(id, acceptedby)
        const person = await accappointment.findById(id);
        if (!person) {
            console.log("Appointment not found")
            return res.status(404).send('Appointment not found');
           
        }

        // Find the doctor by the acceptedby (doctor's Gmail)
        const doctor = await Doctor.findOne({ gmail: acceptedby });
        if (!doctor) {
            console.log("Doctor not found")
            return res.status(404).send('Doctor not found');
        }

        // Find the day of the week for the appointment date
        const appointmentDate = new Date(person.date);
        const dayOfWeek = appointmentDate.toLocaleString('en-us', { weekday: 'long' });

        // Add the time slot back to the doctor's available slots for that day
        doctor.slots[dayOfWeek] = [...doctor.slots[dayOfWeek], person.time];

        // Sort the slots in chronological order
        doctor.slots[dayOfWeek].sort((a, b) => {
            const timeA = a.split(':').map(Number);
            const timeB = b.split(':').map(Number);

            // Convert times to minutes to compare them numerically
            const minutesA = timeA[0] * 60 + timeA[1];
            const minutesB = timeB[0] * 60 + timeB[1];

            return minutesA - minutesB; // Sort in ascending order of time
        });

        // Save the updated doctor document
        await doctor.save();

        // Create a rejected appointment entry
        const rejappointmentEntry = new rejappointment({
            date: person.date,
            time: person.time,
            description: person.description,
            createdy: person.createdy,
            created: person.created,
            fields: person.fields,
            college: person.college,
            rejectedby: acceptedby,
            rejectedat: new Date(),
        });

        // Save the rejected appointment entry
        await rejappointmentEntry.save();

        // Delete the original accepted appointment
        await accappointment.findByIdAndDelete(id);
        const cacheKey = `appointment:${id}`;
        await redisClient.del(cacheKey);
        // Return success response
        return res.status(200).json('Appointment deleted and slot restored successfully');
    } catch (error) {
        console.error('Error during deletion:', error);
        return res.status(500).json({ message: 'Error deleting appointment', error });
    }
}

async function getpatients(req, res) {
  const { email, page = 1, limit = 10 } = req.body;

  console.log(email);

  try {
    // Step 1: Check Redis for appointments
    const keys = await redisClient.keys('appointment:*');
    let appointments = [];

    if (keys.length > 0) {
      // Fetch all appointments from Redis
      const appointmentsData = await redisClient.mGet(keys);
      appointments = appointmentsData
        .map(data => JSON.parse(data))
        .filter(app => app.acceptedby === email);
    }

    // Step 2: Filter by date (only past and current appointments)
    const now = new Date();
    let patients = [];

    if (appointments.length > 0) {
      console.log("Cache hit and filtered appointments");
      patients = appointments.filter(app => new Date(app.date) <= now);

      // Sort by date ascending
      patients.sort((a, b) => new Date(a.date) - new Date(b.date));

      // Apply pagination
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
      const paginatedPatients = patients.slice(startIndex, endIndex);

      return res.json({
        patients: paginatedPatients,
        total: patients.length,
        page: Number(page),
        totalPages: Math.ceil(patients.length / limit)
      });
    }

    // Step 3: Cache miss - Fetch appointments from DB
    patients = await accappointment.find({
      acceptedby: email,
      date: { $lte: now }
    }).sort({ date: 1 });

    console.log("Cache miss - Fetching from DB");

    // Step 4: Cache the DB results in Redis for future use
    const pipeline = redisClient.multi();
    patients.forEach(patient => {
      pipeline.set(`appointment:${patient._id}`, JSON.stringify(patient));
    });
    await pipeline.exec();
    console.log("Appointments cached in Redis");

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedPatients = patients.slice(startIndex, endIndex);

    return res.status(200).json({
      patients: paginatedPatients,
      total: patients.length,
      page: Number(page),
      totalPages: Math.ceil(patients.length / limit)
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

async function addreport(req,res){
    const {report,email,college} = req.body
    console.log(report,email,college)
    const rep =await reportdb.create({report:report,createdby:email,createdon:new Date(),college:college})
    return res.status(200).json({msg:"succesfull"})
}

function generateOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
}
async function sendotp(req,res){
    const { email } = req.body;
    console.log(email)

    try {
        const otp = generateOtp();
        const doctor = await Doctor.findOne({ gmail:email });
        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }
        doctor.otp = otp;
        await doctor.save();

        // Send email with the OTP
        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: "campuscarec@gmail.com", // Replace with your email
                pass: "aifq hosc uyeg expi",       // Replace with your email password
            },
        });

        const mailOptions = {
            from: "campuscarec@gmail.com",
            to: email,
            subject: "Your OTP for Password Reset",
            text: `Your OTP is: ${otp}`,
        };

        await transporter.sendMail(mailOptions);
        res.json({ message: "OTP sent to your email" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error sending OTP" });
    }
}
async function handleforget(req,res){
    const { email, otp } = req.body;
console.log(email,otp)
    try {
        // Find the Doctor and check the OTP
        console.log(email,otp)
        const doctor = await Doctor.findOne({ gmail:email });
        if (!doctor) {
            return res.status(200).json({ message: "Doctor not found" });
        }
        
        if (doctor.otp !== otp) {
            console.log(doctor.otp)
            return res.status(200).json({ message: "Invalid OTP" });
        }

        // OTP is valid; you can proceed to reset the password
        res.json({ message: "OTP verified successfully" });
    } catch (error) {
        console.error(error);
        res.status(200).json({ message: "Error verifying OTP" });
    }
}
async function resetp(req,res){
    const { password, email } = req.body;
    console.log(password+email)
    try {
        // Find the student by email
        const student = await Doctor.findOne({ gmail:email });
        if (!student) {
            return res.status(404).json({ success: false, message: "Doctor not found" });
        }

        // Update the password
        student.password = password; // Direct assignment (use hashing in real apps for security)
        await student.save();

        res.json({ success: true, message: "Password reset successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error resetting password" });
    }
}

async function getslotsdoc(req, res) {
    try {
        const { gmail } = req.body;
        console.log("Fetching slots for:", gmail);

        // Find the doctor by email
        const doc = await Doctor.findOne({ gmail });
        
        if (!doc) {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        // Return the slots
        res.status(200).json({ slots: doc.slots });
    } catch (error) {
        console.error("Error fetching slots:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
async function adddoc(req,res){
    console.log(req.body)
    const {email,password,field,college} = req.body
    await Doctor.create({gmail:email,password:password,fields:field,college:college.college})
    return res.status(200).json({msg:'doctor added succesfull '})
}
async function modifyleaves(req, res) {
  const { leaveid, message } = req.body;
  console.log(`${leaveid} ${message} hello`);

  try {
    // Step 1: Find the leave document from DB using leaveid (_id from MongoDB)
    const leave = await Leave.findById(leaveid);

    if (!leave) {
      return res.status(404).json({ message: "No leave found" });
    }

    const appointmentid = leave.appointmentId; // Assuming your leave document has this field

    if (!appointmentid) {
      return res.status(400).json({ message: "Appointment ID missing in leave" });
    }

    // Step 2: Try to find the leave in cache with key leave:<appointmentid>
    const cacheKey = `leave:${appointmentid}`;
    const cachedLeaveString = await redisClient.get(cacheKey);

    if (cachedLeaveString) {
      // Step 3: Found in cache
      const cachedLeave = JSON.parse(cachedLeaveString);

      // Step 4: Update status
      cachedLeave.status = message;

      // Step 5: Update cache
      await redisClient.set(cacheKey, JSON.stringify(cachedLeave), 'EX', 60 * 60 * 24); // 1 day expiry

      console.log("Leave updated in cache");
    }

    // Step 6: Update the database anyway
    leave.status = message;
    await leave.save();

    console.log("Leave updated in database");
    return res.status(200).json({ message: "Leave status updated successfully" });

  } catch (error) {
    console.error("Error updating leave:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}


  
module.exports = {getcolleges,handlelogin,givehomedet,deleteapp,getpatients,addreport,sendotp,handleforget,resetp,getslotsdoc,adddoc,modifyleaves}
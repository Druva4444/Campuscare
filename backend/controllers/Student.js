const Doctor = require('../model/doctor');
const Students = require('../model/user')
const express= require('express');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const mongoose =  require('mongoose');
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const secret = 'venkat';
const Collage = require('../model/college')
const reportdb = require('../model/report')
const accappointment = require('../model/acceptedappointments')
const rejappointment = require('../model/rejectedappointments')
const Leave = require('../model/leave')
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



async function handleloginS(req, res) {
  try {
      const { email, password1, college, checkbox } = req.body;
      console.log(req.body);

      const specificUser = await Students.findOne({ gmail: email, password: password1, college });

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

      // Optional: You can log today's appointments or other actions here if needed
      // For example:
      // const today = new Date();
      // ... (appointment queries)

      // Send token and userdetails to frontend; frontend will store them as cookies
      return res.status(200).json({
          message: "Login Succesful",
          token: token || null,
          userdetails
      });

  } catch (error) {
      console.error("Error processing student login:", error);
      return res.status(500).send("Internal Server Error");
  }
}


async function handlestudenthome(req, res) {
  const { email, page = 1, limit = 10 } = req.body;
  console.log(email);

  try {
    const keys = await redisClient.keys('appointment:*');
    let appointments = [];

    if (keys.length > 0) {
      const appointmentsData = await redisClient.mGet(keys);
      appointments = appointmentsData
        .map(data => JSON.parse(data))
        .filter(app => app.createdy === email);
    }

    const now = new Date();
    let total = [], comi = [], upcom = [];

    if (appointments.length > 0) {
      console.log("Cache hit and filtered appointments");

      total = appointments; // all appointments
      comi = appointments.filter(app => new Date(app.date) < now);
      upcom = appointments.filter(app => new Date(app.date) >= now);

      // Sort comi by date
      comi.sort((a, b) => new Date(a.date) - new Date(b.date));

      // Apply pagination to comi only
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
      const paginatedComi = comi.slice(startIndex, endIndex);

      return res.json({
        total,
        comi,
        upcom,
        comiCount: comi.length,
        page: Number(page),
        totalPages: Math.ceil(comi.length / limit)
      });
    }

    // DB fallback if Redis miss
    total = await accappointment.find({ createdy: email }).sort({ date: 1 });
    comi = await accappointment.find({ createdy: email, date: { $lt: now } }).sort({ date: 1 });
    upcom = await accappointment.find({ createdy: email, date: { $gte: now } }).sort({ date: 1 });

    console.log("DB fallback");

    // Apply pagination to comi
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedComi = comi.slice(startIndex, endIndex);

    return res.json({
      total,
      comi: paginatedComi,
      upcom,
      comiCount: comi.length,
      page: Number(page),
      totalPages: Math.ceil(comi.length / limit)
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}


async function deletebooking(req,res){
   
    const { id } = req.body;
  console.log('inside delete block')
  console.log(id)
    try {
        const appointment = await accappointment.findById(id);
        if (!appointment) {
          console.log('Appointment not found');
            return res.status(404).json({ message: 'Appointment not found' });
        }
        const acceptedby = appointment.acceptedby;
        const doctor = await Doctor.findOne({ gmail: acceptedby });
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }
        const appointmentDate = new Date(appointment.date);
        const dayOfWeek = appointmentDate.toLocaleString('en-us', { weekday: 'long' });
        doctor.slots[dayOfWeek] = [...doctor.slots[dayOfWeek], appointment.time];
        doctor.slots[dayOfWeek].sort((a, b) => {
            const timeA = a.split(':').map(Number);
            const timeB = b.split(':').map(Number);
            const minutesA = timeA[0] * 60 + timeA[1];
            const minutesB = timeB[0] * 60 + timeB[1];

            return minutesA - minutesB; 
        });
        await doctor.save();
        await accappointment.findByIdAndDelete(id);
        console.log("Appointment deleted successfully");
        const cacheKey = `appointment:${id}`;
        await redisClient.del(cacheKey);
        return res.status(200).json({ msg: 'Appointment deleted successfully and slot restored' });
    } catch (error) {
        console.error('Error deleting appointment:', error);
        return res.status(500).json({ message: 'Error deleting appointment', error });
    }
}
function generateOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString(); 
}
async function handleverify(req,res){
    const { email, otp } = req.body;
console.log(email,otp)
    try {
        console.log(email,otp)
        const cachekey = `students:${email}`;
        const cachedData = await redisClient.get(cachekey);
        if (cachedData) {
            console.log("Cache hit");
            const doctor = JSON.parse(cachedData);
            if (doctor.otp !== otp) {
                return res.status(200).json({ message: "Invalid OTP" });
            }
            res.json({ message: "OTP verified successfully" });
            return;
        }
        const doctor = await Students.findOne({ gmail:email });
        if (!doctor) {
            return res.status(200).json({ message: "Student not found" });
        }
        
        if (doctor.otp !== otp) {
            console.log(doctor.otp)
            return res.status(200).json({ message: "Invalid OTP" });
        }
        res.json({ message: "OTP verified successfully" });
    } catch (error) {
        console.error(error);
        res.status(200).json({ message: "Error verifying OTP" });
    }

}
async function sendotps(req,res){
    const { email } = req.body;
    console.log(email)
    const cachekey = `students:${email}`;
    
    try {
        const otp = generateOtp();
        const doctor = await Students.findOne({ gmail:email });
        if (!doctor) {
            return res.status(404).json({ message: "student not found" });
        }
        doctor.otp = otp;
        await doctor.save();
        await redisClient.set(cachekey, otp, { EX: 300 });
        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: "campuscarec@gmail.com", 
                pass: "aifq hosc uyeg expi",      
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
async function resetps(req,res){
    const { password, email } = req.body;
    console.log(password+email)
    try {
        const student = await Students.findOne({ gmail:email });
        if (!student) {
            return res.status(404).json({ success: false, message: "Student not found" });
        }
        student.password = password; 
        await student.save();

        res.json({ success: true, message: "Password reset successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error resetting password" });
    }
}
async function handle_appointments(req, res) {
  const { college } = req.body;
  console.log(college);

  const pattern = 'doctor:*'; 

  try {
      // Fetch all keys that match the pattern 'doctor:*' (You need to have the list of keys)
      const keys = await redisClient.keys(pattern);

      if (keys.length === 0) {
          console.log("No doctors found in cache, fetching from DB...");
          // Fetch doctors from the DB if no data in Redis
          const doctors = await Doctor.find({ college: college });
          // Cache the result for future use (only cache for the requested college)
          await redisClient.set(`doctors:${college}`, JSON.stringify(doctors), 'EX', 3600); // Cache for 1 hour

          return res.json({ msg: doctors });
      }

      // Fetch all doctor data from Redis using MGET
      const doctorsData = await redisClient.mGet(keys);

      // Parse the doctor data from Redis
      const allDoctors = doctorsData.map(data => JSON.parse(data));

      // Filter doctors by college
      const filteredDoctors = allDoctors.filter(doctor => doctor.college === college);

      if (filteredDoctors.length === 0) {
          console.log("No doctors found for the specified college");
          // Fetch doctors from the DB and cache for the college if not found in cache
          const doctors = await Doctor.find({ college: college });
          await redisClient.set(`doctors:${college}`, JSON.stringify(doctors), 'EX', 3600); // Cache for 1 hour

          return res.json({ msg: doctors });
      }

      // Return filtered doctors from cache
      return res.json({ msg: filteredDoctors });

  } catch (error) {
      console.error(error);
      return res.status(500).json({ msg: "Error handling appointments" });
  }
}


async function getslots(req,res){
    const { gmail, date } = req.body;
    console.log(gmail,date)
    try {
      const doctor = await Doctor.findOne({ gmail });
      if (!doctor) {
        return res.status(404).json({ message: 'Doctor not found' });
      }
       const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const selectedDate = new Date(date);
      const dayOfWeek = daysOfWeek[selectedDate.getDay()];
      const availableSlots = doctor.slots[dayOfWeek];

      return res.json({ slots: availableSlots });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error fetching slots' });
    }
}
async function  bookslot(req,res){
    const { gmail, timeSlot, description, date, user, college } = req.body;
    
    try {
        const appointmentDate = new Date(date);
        const dayIndex = appointmentDate.getDay();
        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const day = daysOfWeek[dayIndex];
        const doctor = await Doctor.findOne({ gmail });
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }
        if (!doctor.slots[day] || !doctor.slots[day].includes(timeSlot)) {
            return res.status(400).json({ message: 'Time slot not available' });
        }
        doctor.slots[day] = doctor.slots[day].filter(slot => slot !== timeSlot);

        await doctor.save();
        const newAppointment = await accappointment.create({
            date: date,
            time: timeSlot,
            description: description,
            created: new Date(),
            acceptedby: gmail,
            createdy: user,    
            college: college    
        });
        const appointmentData = {
          _id: newAppointment._id,
            date: date,
            time: timeSlot,
            description: description,
            created: new Date(),
            acceptedby: gmail,
            createdy: user,
            college: college
        };
        await redisClient.set(`appointment:${newAppointment._id}`, JSON.stringify(appointmentData));
        
        res.status(200).json({
            message: 'Slot booked successfully',
            updatedSlots: doctor.slots[day],  // Return the updated slots for the correct day
            appointment: newAppointment     
        });
    
    } catch (error) {
        console.error('Error booking slot:', error);
        res.status(500).json({ message: 'Error booking slot', error: error.message });
    }
    
    
}
async function addstu(req,res){
    console.log(req.body)
    const {email,password,college} = req.body
    await Students.create({gmail:email,password:password,college:college.college})
    return res.status(200).json({msg:'student added succesfull '})
}
async function fetchcolleges1(req, res) {
    try {
      const collegeKeys = await redisClient.keys('college:*');
  
      let colleges = [];
  
      if (collegeKeys.length > 0) {
        // Fetch all college details from Redis
        const collegeValues = await redisClient.mGet(collegeKeys);
        colleges = collegeValues.map(value => JSON.parse(value));
        console.log('Fetched from Redis');
      } else {
        colleges = await Collage.find();
        console.log('Fetched from DB');
        const pipeline = redisClient.multi();
        colleges.forEach(college => {
          pipeline.set(`college:${college.name}`, JSON.stringify(college));
        });
        await pipeline.exec();
      }
  
      return res.json(colleges);
      
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
  
  async function Addstudent(req, res) {
    try {
    
      const { email, password, confirmpassword, collegeId } = req.body;
      console.log(password  )
      const clg = await Collage.findOne({ collegeId });
  
      if (!clg) {
        return res.status(404).json({ message: "College not found" });
      }
  
      const domain = clg.domain;
  
      const emailDomain = email.split("@")[1];

      if (emailDomain !== domain) {
        return res.status(400).json({ message: "Email domain does not match college domain" });
      }
      if (password !== confirmpassword) {
        return res.status(400).json({ message: "Passwords do not match" });
      }
  
      const user = new Students({
        gmail: email,
        password: password,
        college: clg.name,
      });
  
      await user.save();
  
      return res.status(201).json({ message: "Student added successfully", student: user });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
  async function applyleave(req, res) {
    const { email, data, startDate, endDate } = req.body;
    console.log(email + 353);
    console.log(data._id);
    try {
      const leaveKey = `leave:${data._id}`;
     
      const cachedLeave = await redisClient.get(leaveKey);
      if (cachedLeave) {
        console.log('Leave found in Redis');
        return res.status(400).json({ message: "Leave for this appointment already exists (cached)" });
      }
      const leave = await Leave.findOne({ appointmentId: data._id });
  
      if (leave) {
        await redisClient.set(leaveKey, JSON.stringify(leave));
        console.log('Leave found in DB and cached');
        return res.status(400).json({ message: "Leave for this appointment already exists" });
      }
      const newLeave = await Leave.create({
        email: email,
        appointmentId: data._id,
        doctoremail: data.acceptedby,
        startdate: startDate,
        college: data.college,
        enddate: endDate
      });
      await redisClient.set(leaveKey, JSON.stringify(newLeave));
      console.log('New leave created and cached');
  
      return res.status(200).json({ message: "Leave successfully created" });
  
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
  async function getleaves(req, res) {
    const { email } = req.query;
    console.log(email + 312);
  
    try {
      const keys = await redisClient.keys('leave:*');
  
      let leaves = [];
  
      if (keys.length > 0) {
        const leavesData = await redisClient.mGet(keys);
        leaves = leavesData
          .map(data => JSON.parse(data))
          .filter(leave => leave.email === email);
  
        console.log('Leaves fetched and filtered from Redis');
      }
  
      if (leaves.length > 0) {
        return res.status(200).json(leaves);
      }
      leaves = await Leave.find({ email: email });
      console.log('Leaves fetched from DB');
  
      if (!leaves || leaves.length === 0) {
        return res.status(404).json({ message: "No leaves found" });
      }
      const pipeline = redisClient.multi();
      leaves.forEach(leave => {
        pipeline.set(`leave:${leave.appointmentId}`, JSON.stringify(leave));
      });
      await pipeline.exec();
      console.log('Leaves cached in Redis');
  
      return res.status(200).json(leaves);
  
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
  
  async function getleaves2(req, res) {
    const { email } = req.query;
    console.log(email + 888); // for debug
    console.log('inside '); // for debug
    try {
      const keys = await redisClient.keys('leave:*');
  
      let leaves = [];
  
      if (keys.length > 0) {
        const leavesData = await redisClient.mGet(keys);
        leaves = leavesData
          .map(data => JSON.parse(data))
          .filter(leave => leave.doctoremail === email);
  
        console.log('Leaves fetched and filtered by doctoremail from Redis');
      }
  
      if (leaves.length > 0) {
        return res.status(200).json(leaves);
      }
      leaves = await Leave.find({ doctoremail: email });
      console.log('Leaves fetched from DB');
  
      if (!leaves || leaves.length === 0) {
        return res.status(404).json({ message: "No leaves found" });
      }
  
      // Step 5 (optional): Cache each leave in Redis
      const pipeline = redisClient.multi();
      leaves.forEach(leave => {
        pipeline.set(`leave:${leave.appointmentId}`, JSON.stringify(leave));
      });
      await pipeline.exec();
      console.log('Leaves cached in Redis');
  
      return res.status(200).json(leaves);
  
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
  
module.exports = {handleloginS,handlestudenthome,deletebooking,handleverify,sendotps,resetps,handle_appointments,getslots,bookslot,addstu,fetchcolleges1,Addstudent,applyleave,getleaves,getleaves2}
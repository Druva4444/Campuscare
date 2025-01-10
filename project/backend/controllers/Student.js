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

async function handleloginS(req,res){
    try {
        const { email, password1, college, checkbox } = req.body;
        console.log(req.body);
        const specificUser = await Students.findOne({ gmail: email, password: password1, college });
        if (!specificUser) {
            console.log("No user found");
            
            
            return res.status(200).json({ message: "Invalid credentials. Please try again." });
            
        }
        if (checkbox) {
            const token = jwt.sign(
                {
                    gmail: specificUser.gmail,
                    password: specificUser.password,
                    clg: specificUser.college,
                },
                "druva123", 
                { expiresIn: "4d" } // Token valid for 1 day
            );
            res.cookie("Uid2", token, { maxAge: 4*24 * 60 * 60 * 1000},{ sameSite: 'None', secure: true });
        }

        res.cookie("userdetails", JSON.stringify({
            gmail: specificUser.gmail,
            college: specificUser.college,
        }),{ sameSite: 'None', secure: true });

     
        return res.status(200).json({ message: "Login Succesful" });
    } catch (error) {
        console.error("Error processing doctor login:", error);
        return res.status(500).send("Internal Server Error");
    }
}
async function handlestudenthome(req,res){
    const { email } = req.body;
    
    console.log(email)
    const total = await accappointment.find({createdy:email,date:{$gt:new Date()}}).sort({date:1})
    const now = new Date(); 
    console.log(now); 
    const comi = await accappointment.find({
      createdy: email,
      date: { $lt: now }
    }).sort({ date: 1 });
    const upcom = await accappointment.find({
        createdy: email,
        date: { $gte: now }
      }).sort({ date: 1 });
    console.log(comi)
    
    return res.json({total,comi,upcom})
}
async function deletebooking(req,res){
    const { id } = req.body;

    try {
        // Find the appointment by ID
        const appointment = await accappointment.findById(id);
        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        // Extract the doctor's Gmail from the appointment (acceptedby field)
        const acceptedby = appointment.acceptedby;

        // Find the doctor by the acceptedby (doctor's Gmail)
        const doctor = await Doctor.findOne({ gmail: acceptedby });
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        // Find the day of the week for the appointment date
        const appointmentDate = new Date(appointment.date);
        const dayOfWeek = appointmentDate.toLocaleString('en-us', { weekday: 'long' });

        // Add the time slot back to the doctor's available slots for that day
        doctor.slots[dayOfWeek] = [...doctor.slots[dayOfWeek], appointment.time];

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

        // Delete the appointment
        await accappointment.findByIdAndDelete(id);

        // Return success response
        return res.status(200).json({ msg: 'Appointment deleted successfully and slot restored' });
    } catch (error) {
        console.error('Error deleting appointment:', error);
        return res.status(500).json({ message: 'Error deleting appointment', error });
    }
}
function generateOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
}
async function handleverify(req,res){
    const { email, otp } = req.body;
console.log(email,otp)
    try {
        // Find the Doctor and check the OTP
        console.log(email,otp)
        const doctor = await Students.findOne({ gmail:email });
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
async function sendotps(req,res){
    const { email } = req.body;
    console.log(email)

    try {
        const otp = generateOtp();
        const doctor = await Students.findOne({ gmail:email });
        if (!doctor) {
            return res.status(404).json({ message: "student not found" });
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
async function resetps(req,res){
    const { password, email } = req.body;
    console.log(password+email)
    try {
        // Find the student by email
        const student = await Students.findOne({ gmail:email });
        if (!student) {
            return res.status(404).json({ success: false, message: "Student not found" });
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
async function handle_appointments(req,res){
    const {college} = req.body;
    console.log(college)
    const doctors =await  Doctor.find({college:college})
    console.log(doctors)
    return res.json({msg:doctors})
}

async function getslots(req,res){
    const { gmail, date } = req.body;
    console.log(gmail,date)
  
    try {
      // Find the doctor by gmail
      const doctor = await Doctor.findOne({ gmail });
      
      if (!doctor) {
        return res.status(404).json({ message: 'Doctor not found' });
      }
      
      // Get the day of the week (e.g., 'Monday', 'Tuesday') from the selected date
      const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const selectedDate = new Date(date);
      const dayOfWeek = daysOfWeek[selectedDate.getDay()];
  
      // Fetch the available slots for the selected day
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
        // Convert the date string into a JavaScript Date object
        const appointmentDate = new Date(date);
        
        // Get the day of the week (0 for Sunday, 1 for Monday, ..., 6 for Saturday)
        const dayIndex = appointmentDate.getDay();
        
        // Map day index to day name (e.g., 0 -> 'Sunday', 1 -> 'Monday', etc.)
        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const day = daysOfWeek[dayIndex]; // e.g., 'Monday' if the date is a Monday
    
        // Find the doctor using the provided Gmail address
        const doctor = await Doctor.findOne({ gmail });
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }
    
        // Check if the day and time slot are valid and available
        if (!doctor.slots[day] || !doctor.slots[day].includes(timeSlot)) {
            return res.status(400).json({ message: 'Time slot not available' });
        }
    
        // Remove the time slot from the doctor's available slots
        doctor.slots[day] = doctor.slots[day].filter(slot => slot !== timeSlot);
    
        // Save the updated doctor information
        await doctor.save();
    
        // Create a new appointment
        const newAppointment = await accappointment.create({
            date: date,
            time: timeSlot,
            description: description,
            created: new Date(),
            acceptedby: gmail,  // Doctor who accepted the appointment
            createdy: user,     // User who requested the appointment
            college: college    // College associated with the user
        });
    
        // Return the success response with the updated available slots for the doctor
        res.status(200).json({
            message: 'Slot booked successfully',
            updatedSlots: doctor.slots[day],  // Return the updated slots for the correct day
            appointment: newAppointment      // Include the created appointment data
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
    
  
      const colleges = await Collage.find(); 
      console.log(colleges)
      return res.json(colleges); 
  
    } catch (error) {
      console.log(error);
         res.status(500).json({ message: 'Internal server error' });
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
  
module.exports = {handleloginS,handlestudenthome,deletebooking,handleverify,sendotps,resetps,handle_appointments,getslots,bookslot,addstu,fetchcolleges1,Addstudent}
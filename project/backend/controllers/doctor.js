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
async function getcolleges(req, res) {
    try {
        try {
            const colleges = await Collage.find(); 
            console.log(colleges);
            return res.json(colleges); 
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch colleges' });
        }
    } catch (error) {
        console.log(error);
    }
}
async function postdslogin(req,res){
      try {
        
      } catch (error) {
        res.status(500).json({ error: 'Failed to login' });
      }
}

async function handlelogin(req,res){
    try {
        const { email, password1, college, checkbox } = req.body;
        console.log(req.body);
        // Fetch the doctor based on credentials
        const specificUser = await Doctor.findOne({ gmail: email, password: password1, college });
        if (!specificUser) {
            console.log("No user found");

         
            
            return res.status(200).json({ message: "Invalid credentials. Please try again." });
            
        }

        // Handle "Remember Me" and create a persistent JWT token
        if (checkbox) {
            const token = jwt.sign(
                {
                    gmail: specificUser.gmail,
                    password: specificUser.password,
                    clg: specificUser.college,
                },
                "druva123", // Secret key
                { expiresIn: "4d" } // Token valid for 1 day
            );
            res.cookie("Uid1", token, { maxAge: 24 * 60 * 60 * 1000},{ sameSite: 'None', secure: true });
        }

        // Set user details in cookies
        res.cookie("userdetails", JSON.stringify({
            gmail: specificUser.gmail,
            college: specificUser.college,
        }),{ sameSite: 'None', secure: true });

        // Fetch all appointments
        const appointments = await accappointment.find({
            date: { $gte: new Date() },
        }).sort({ date: 1, time: 1 });

        // Fetch today's appointments
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Start of today
        const todayAppointments = await accappointment.find({
            date: {
                $gte: today, // Start of today
                $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000), // Start of tomorrow
            },
        }).sort({ date: 1, time: 1 });

        console.log("Today's Appointments:", todayAppointments);
        // Redirect to the doctor's home page
        return res.status(200).json({ message: "Login Succesful" });
    } catch (error) {
        console.error("Error processing doctor login:", error);

        // Return a 500 error for internal server errors
        return res.status(500).send("Internal Server Error");
    }
}
async function givehomedet(req,res){
    const { email } = req.body;
    
    // Example logic to get the number of appointments for the given email
    // You would fetch this from a database, such as MongoDB, SQL, etc.
    
    console.log(email)
    const total = await accappointment.find({acceptedby:email,date:{$lte:new Date()}})
    const now = new Date(); // Current UTC date
    console.log(now); // Debug: Verify the date
    const upcomi = await accappointment.find({
      acceptedby: email,
      date: { $gte: now }
    }).sort({ date: 1 });
    console.log(upcomi)
    return res.json({total,upcomi})
}
async function deleteapp(req, res) {
    const { id, acceptedby } = req.body;

    try {
        // Find the appointment by ID
        const person = await accappointment.findById(id);
        if (!person) {
            return res.status(404).send('Appointment not found');
        }

        // Find the doctor by the acceptedby (doctor's Gmail)
        const doctor = await Doctor.findOne({ gmail: acceptedby });
        if (!doctor) {
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

        // Return success response
        return res.status(200).json('Appointment deleted and slot restored successfully');
    } catch (error) {
        console.error('Error during deletion:', error);
        return res.status(500).json({ message: 'Error deleting appointment', error });
    }
}

async function getpatients(req,res){
    const { email} = req.body
    console.log(email)
    const patients = await accappointment.find({acceptedby:email,date:{$lt:new Date()}})
    console.log(patients)
    return res.status(200).json({patients})
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
async function modifyleaves(req,res) {
    const {leaveid,message} = req.body;
    console.log(leaveid + message + "hello");
    try {
        const leave = await  Leave.findById({_id:leaveid});
        if (!leave) {
            return res.json(404).json({message:"No leave found"})
        }
        await Leave.findByIdAndUpdate(leaveid,{status:message});
        console.log(leave)
    } catch (error) {
        
    }
}
module.exports = {getcolleges,handlelogin,givehomedet,deleteapp,getpatients,addreport,sendotp,handleforget,resetp,getslotsdoc,adddoc,modifyleaves}
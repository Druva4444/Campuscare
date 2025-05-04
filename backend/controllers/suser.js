const Doctor = require('../model/doctor');
const express= require('express');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const mongoose =  require('mongoose');
const secret = 'venkat';
const student = require('../model/user');
const Collage = require('../model/college');
const suser =  require('../model/suser');
const accappointment = require('../model/acceptedappointments');
const WaitingClgs = require('../model/pendingclgs')
const admin = require('../model/admin')
const nodemailer = require('nodemailer')
async function postloginpage(req, res) {
    const { email, password, rememberMe } = req.body;
    console.log(email,password,rememberMe)
    try {
        const isuser = await suser.findOne({
            email: email
        });
        if (!isuser) {
            return res.status(400).json({ message: "Invalid email, please signup!" });
        }
        if (isuser.password !== password) {
            return res.status(400).json({ message: "Invalid password" });
        }

        let token = null; 

        if (rememberMe) {
            token = jwt.sign({
                email: email,
                role: "superuser"
            }, "venkat");
            console.log('inside if')
            console.log(token)
            res.cookie("Uid4", token, { maxAge: 2 * 24 * 60 * 60 * 1000  }, {
              httpOnly: false,
              secure: true,        // important if you're using HTTPS
              sameSite: "None",
              domain:"campuscare-1.onrender.com"     // must be 'None' for cross-site cookies
          });
        }

        res.cookie("userdetails", JSON.stringify({ email: email, role: "superuser" }), {
          httpOnly: false,
          secure: true,        // important if you're using HTTPS
          sameSite: "None" ,
          domain:"campuscare-1.onrender.com"    // must be 'None' for cross-site cookies
      });
        res.status(200).json({ message: 'Login successful', token });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server error' });
    }
}
async function handlelogout(req, res) {
    try {
      const { Uid4, userdetails } = req.cookies;
  
      if (Uid4) {
        res.clearCookie('Uid4', { httpOnly: false });
      }
  
      if (userdetails) {
        res.clearCookie('userdetails', { httpOnly: false });
      }
  
      return res.status(200).json({ message: 'Logged out successfully' });
    } catch (err) {
      console.error('Error during logout:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
  
  
async function gethome(req,res) {
    const token = req.cookies.Uid4
        const userdetails = req.cookies.userdetails
        let mail
        if(token){
            const detoken = jwt.verify(token,"venkat")
             mail = detoken.email
        }
        else{
           const  {email,role} = JSON.parse(userdetails)
           mail= email
        }
        
        const upcominapp = await accappointment.find({date:{$gte:new Date()}})
        const completedapp = await accappointment.find({date:{$lte: new Date()}})
        const clgs =  await Collage.find({})
        const admins = await admin.find({});
        let amount=0;
        for(let i =0;i<clgs.length;i++){
            amount+=clgs[i].amount
        }
        res.json({upcominapp,completedapp,clgs,admins,amount});
}
async function getadminpage(req,res) {
    const token = req.cookies.Uid4
        const userdetails = req.cookies.userdetails
        let mail
        if(token){
            const detoken = jwt.verify(token,"venkat")
             mail = detoken.email
        }
        else{
           const  {email,role} = JSON.parse(userdetails)
           mail= email
        }
        const admins = await admin.find({})
        console.log(admins)
        res.json({admins})
}
async function deleteadmins(req,res){
 try {
  const {adminId} =req.body;
  console.log(adminId)
  const token = req.cookies.Uid4
  const userdetails = req.cookies.userdetails
  let mail
  if(token){
      const detoken = jwt.verify(token,"venkat")
       mail = detoken.email
       console.log(mail)
  }
  else{
     const  {email,role} = JSON.parse(userdetails)
     mail= email
  }
  if (!adminId) {
    return res.status(400).json({ message: 'User ID is required' });
}
console.log(adminId)


    
    const deletedUser = await admin.findByIdAndDelete(adminId);

    if (!deletedUser) {
        return res.status(404).json({ message: 'User not found' });
    }


    res.status(200).json({ message: 'User deleted successfully', deletedUser });
 } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error' });
 }

}
async function handledeletecollege(req,res){
    try {
     const {collegeId} =req.body;
     console.log(collegeId)
     const token = req.cookies.Uid4
     const userdetails = req.cookies.userdetails
     let mail
     if(token){
         const detoken = jwt.verify(token,"venkat")
          mail = detoken.email
          console.log(mail)
     }
     else{
        const  {email,role} = JSON.parse(userdetails)
        mail= email
     }
     if (!collegeId) {
       return res.status(400).json({ message: 'User ID is required' });
   }
   console.log(collegeId)
       const deletedUser = await Collage.findByIdAndDelete(collegeId);
   
       if (!deletedUser) {
           return res.status(404).json({ message: 'User not found' });
       }
   
   
       res.status(200).json({ message: 'User deleted successfully', deletedUser });
    } catch (error) {
       console.log(error);
       res.status(500).json({ message: 'Internal server error' });
    }
   
   }
async function getcolleges1(req, res) {
  try {
    const token = req.cookies.Uid4
    const userdetails = req.cookies.userdetails
    let mail
    if(token){
        const detoken = jwt.verify(token,"venkat")
         mail = detoken.email
         console.log(mail)
    }
    else{
       const  {email,role} = JSON.parse(userdetails)
       mail= email
    }

    const colleges = await Collage.find(); 
    console.log(colleges)
    return res.json(colleges); 

  } catch (error) {
    console.log(error);
       res.status(500).json({ message: 'Internal server error' });
  }
}
async function Addadmin(req,res){
try {
    const token = req.cookies.Uid4
    const userdetails = req.cookies.userdetails
    let createduser = null;
    let mail
    if(token){
        const detoken = jwt.verify(token,"venkat")
         mail = detoken.email
         console.log(mail)
    }
    else{
       const  {email,role} = JSON.parse(userdetails)
       mail= email
    } 
    const { emailId, password, confirmpassword, collegeId}= req.body
    if(!collegeId){
        return res.status(400).json({ message: "College ID is required" });
    }
    if(password!= confirmpassword){
        return res.status(400).json({ message: "passwords mismatched" });
    }
    const collegename = await Collage.findById(collegeId);
    console.log(collegename.name)
    const adminexists = await admin.findOne({college:collegename.name});
    if(adminexists){
        return res.status(400).json({ message: "Admin already exists for this college" });
    }
    else{
       createduser =  await admin.create({
          email:emailId,
          password1:password,
          college:collegename.name,
          cretedon: new Date()
        }
        )
    }
    res.status(200).json({ message: 'User created successfully', createduser });
} catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error' });
}
}
async function getGmail(req,res) {
    try {
        const token = req.cookies.Uid4
        const userdetails = req.cookies.userdetails
        let createduser = null;
        let mail
        if(token){
            const detoken = jwt.verify(token,"venkat")
             mail = detoken.email
             console.log(mail)
        }
        else{
           const  {email,role} = JSON.parse(userdetails)
           mail= email
        } 
        res.status(200).json({mail });
    } catch (error) {
        console.log(error);
    res.status(500).json({ message: 'Internal server error' });
    }
}

async function fetchWaitingClgs(req, res){
  WaitingClgs.find().then((clgs) => {
    res.status(200).json({clgs});
  })
}


function generateOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
}
async function susersendotp(req,res){
    const { email } = req.body;
    console.log(email)
    try {
        const otp = generateOtp();
        const Suser = await suser.findOne({ email:email });
        if (!Suser) {
            return res.status(404).json({ message: "suser not found" });
        }
        Suser.otp = otp;
        await Suser.save();

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
async function suserhandleforget(req,res){
    const { email, otp } = req.body;
    console.log(email,otp)
    try {
        // Find the suser and check the OTP
        console.log(email,otp)
        const Suser = await suser.findOne({ email:email });
        if (!Suser) {
            return res.status(200).json({ message: "suser not found" });
        }
        
        if (Suser.otp !== otp) {
            console.log(Suser.otp)
            return res.status(200).json({ message: "Invalid OTP" });
        }

        // OTP is valid; you can proceed to reset the password
        res.json({ message: "OTP verified successfully" });
    } catch (error) {
        console.error(error);
        res.status(200).json({ message: "Error verifying OTP" });
    }
}
async function suserresetp(req,res){
    const { password, email } = req.body;
    console.log(password+email)
    try {
        // Find the student by email
        const student = await suser.findOne({ email:email });
        if (!student) {
            return res.status(404).json({ success: false, message: "suser not found" });
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

async function acceptClgReq(req, res) {
    const { id ,email,password,name } = req.params;
    console.log(id,email);
    console.log(name + 358)
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'campuscarec@gmail.com', 
                pass: "aifq hosc uyeg expi" 
            },
          });
        const clg = await WaitingClgs.findById(id);
        if (!clg) {
            return res.status(404).json("College not found in waiting list");
        }
        const newClgData = { ...clg.toObject() };
        delete newClgData._id;
        const newclg = new Collage(newClgData);
        await newclg.save();
        await admin.create({
          email:email,
          password1 : password,
          college :name,
          cretedon: new Date()
        })
        await WaitingClgs.findByIdAndDelete(id);
        const mailOptions = {
            from: 'campuscarec@gmail.com',
            to: email, // Recipient email
            subject: 'College Request Accepted',
            text: `Dear User,
      
      We are pleased to inform you that your request to add your college "${clg.name}" has been accepted successfully.
      
      Thank you for choosing our platform.
      
      Best regards,
      Campus Care Connect Team`,
          };
          transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
              console.error("Error sending email:", err);
              return res.status(500).json("College added but email notification failed.");
            }
            console.log("Email sent: ", info.response);
            res.status(200).json("College added, removed from waiting list, and email sent successfully.");
          });
    } catch (error) {
        console.error(error);
        res.status(500).json("Error processing the request");
    }
}
async function deleteclgreq(req, res) {
  const { id } = req.params;
  console.log("Deleting College Request:", id);

  try {
      const clg = await WaitingClgs.findById(id);
      if (!clg) {
          return res.status(404).json({ message: "College not found in waiting list" });
      }

      // Delete the college from the waiting list
      await WaitingClgs.findByIdAndDelete(id);

      res.status(200).json({ message: "College request deleted successfully." });
  } catch (error) {
      console.error("Error deleting college request:", error);
      res.status(500).json({ message: "Error processing the request" });
  }
}
async function getcollegepage(req, res) {
    try {
      // Extract user email from cookies
      const token = req.cookies.uid4;
      const userdetails = req.cookies.userdetails;
      let mail;
  
      if (token) {
        const detoken = jwt.verify(token, "venkat");
        mail = detoken.email;
      } else {
        const { email } = JSON.parse(userdetails);
        mail = email;
      }
  
      // Fetch all colleges
      const colleges = await Collage.find({});
  
      // Fetch doctors grouped by their colleges
      const collegeData = await Promise.all(
        colleges.map(async (college) => {
          const associatedDoctors = await Doctor.find({ college: college.name });
          return {
            college,
            doctors: associatedDoctors,
          };
        })
      );
  
      // Fetch students grouped by colleges
      const studentsData = await Promise.all(
        colleges.map(async (college) => {
          const students = await student.find({ college: college.name });
          return { college: college.name, students };
        })
      );
  
      // Fetch completed appointments grouped by colleges
      const completedAppointments = await Promise.all(
        colleges.map(async (college) => {
          const appointments = await accappointment.find({
            college: college.name,
            date: { $lt: new Date() },
          });
          return { college: college.name, appointments };
        })
      );
  
      // Fetch upcoming appointments grouped by colleges
      const upcomingAppointments = await Promise.all(
        colleges.map(async (college) => {
          const appointments = await accappointment.find({
            college: college.name,
            date: { $gte: new Date() },
          });
          return { college: college.name, appointments };
        })
      );
  
      // Combine all data into a structured response
      const responseData = collegeData.map(({ college, doctors }) => {
        const students = studentsData.find((s) => s.college === college.name)?.students || [];
        const completed = completedAppointments.find((c) => c.college === college.name)?.appointments || [];
        const upcoming = upcomingAppointments.find((u) => u.college === college.name)?.appointments || [];
  
        return {
          college,
          doctors,
          students,
          completedAppointments: completed,
          upcomingAppointments: upcoming,
        };
      });
  
      res.json({ email: mail, colleges: responseData });
    } catch (error) {
      console.error("Error in getcollegepage:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
  
  
  async function getstudents(req, res) {
    console.log("fetching students")
    try {
      const students = await student.find(); 
      
      if (!students || students.length === 0) {
        return res.status(404).json({ message: "No students found" });
      }
  
      res.status(200).json({ 
        message: "Students fetched successfully",
        students: students
      });
    } catch (error) {
      console.error("Error fetching students", error);
      res.status(500).json({ message: "Error processing the request" });
    }
  }
  async function searchstudent(req,res){
    console.log("searching")
    try {
      const query = req.query.query; // extract query string
      if (!query) {
        return res.status(400).json({ message: 'Query parameter is missing' });
      }
  
      const students = await student.find({ 
        gmail: { $regex: query, $options: 'i' } 
      });
  
      res.status(200).json({ students });
    } catch (error) {
      console.error("Error searching students", error);
      res.status(500).json({ message: "Error processing the request" });
    }
  }
  async function getappointments(req,res){
    console.log("searching+246")
    try {
      const query = req.query.email; // extract query string
      console.log(query+549)
      if (!query) {
        return res.status(400).json({ message: 'Query parameter is missing' });
      }
  
      const appointments = await accappointment.find({
        createdy:query
      })
     console.log(appointments)
      res.status(200).json({ data:appointments });
    } catch (error) {
      console.error("Error searching students", error);
      res.status(500).json({ message: "Error processing the request" });
    }
  }
  
module.exports = {postloginpage,handlelogout,gethome,getadminpage,deleteadmins,getcollegepage,handledeletecollege 
    ,getcolleges1,Addadmin,getGmail,fetchWaitingClgs , acceptClgReq ,susersendotp , suserhandleforget , suserresetp,deleteclgreq,getstudents,searchstudent,getappointments};
const mongoose = require('mongoose');
const Doctor = require('../model/doctor');
const dmessege = require('../model/dmessege');
const smessege = require('../model/Smessege');
const User = require('../model/user');
const {getReceiverSocketId,io} = require('../socket.js')
 async function getstudents(req, res) {
  try {
    const { id } = req.body;
    console.log(id)
    const user =await  Doctor.findById(id);
    
    const college=user.college;
    console.log(college)
    if (!college) {
      return res.status(400).json({ message: 'College ID is required',user:user });
    }
    const students = await User.find({ college });
    res.status(200).json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ message: 'Internal server error',error:error });
  }
}

 async function dcreateMessage(req, res) {
  try {
    const { from, to, message } = req.body;
    const newMessage = new dmessege({ from, to, message });
    await newMessage.save();
    const receiverSocketId = getReceiverSocketId(to);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }
    const sender = getReceiverSocketId(from)
    io.to(sender).emit('newMessege',newMessage);
    res.status(201).json(newMessage);
  } catch (error) {
    console.error('Error creating message:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

async function dgetMessages(req, res) {
    try {
      const { from, to } = req.body;
      console.log(from, to);
  
      const dmessages = await dmessege.find({
        from,
        to
      }).sort({ createdon: 1 });
  
      const smessages = await smessege.find({
        from: to,
        to: from
      }).sort({ createdon: 1 });
  
      // Merge and sort all messages
      const messages = [...dmessages, ...smessages].sort(
        (a, b) => new Date(a.createdon) - new Date(b.createdon)
      );
  
      console.log(messages);
      res.status(200).json(messages);
    } catch (error) {
      console.error('Error fetching messages:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
  
async function getdoctors(req, res) {
        try {
            const { college } = req.body;
            if (!college) {
                return res.status(400).json({ message: 'College ID is required' });
            }
            const doctors = await Doctor.find({ college });
            res.status(200).json(doctors);
        } catch (error) {
            console.error('Error fetching doctors:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
async function screateMessage(req, res) {
    try {
        const { from, to, message } = req.body;
        const newMessage = new smessege({ from, to, message });
        await newMessage.save();
        console.log(newMessage)
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("newMessage", newMessage);
        }
        res.status(201).json(newMessage);
    } catch (error) {
        console.error('Error creating message:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
async function sgetMessages(req, res) {  
    try {
        const { from, to } = req.body;
        console.log(from,to)
        const dmessages = await dmessege.find({
            from: to,
            to: from
          }).sort({ createdon: 1 });
          
          const smesseges = await smessege.find({
            from,
            to
          }).sort({ createdon: 1 });
          
          // Merge and sort by creation time
          const messages = [...dmessages, ...smesseges].sort(
            (a, b) => new Date(a.createdon) - new Date(b.createdon)
          );
          
          
        console.log(messages)
        res.status(200).json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
    }
async function getstuobj(req,res){
    try{
        const {email}   = req.body;
        console.log(email)
        const student = await User.findOne({gmail:email});
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        console.log(student)
        res.status(200).json(student);
    }catch(error){
        console.error('Error fetching student:', error);
        res.status(500).json({ message: 'Internal server error' });

    }
}
async function getdocobj(req,res){
    try{
        const {email}   = req.body;
        console.log(email)
        const student = await Doctor.findOne({gmail:email});
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        console.log(student)
        res.status(200).json(student);
    }catch(error){
        console.error('Error fetching student:', error);
        res.status(500).json({ message: 'Internal server error' });

    }
}
module.exports = {
    getstudents,
    dcreateMessage,
    dgetMessages,
    getdoctors,
    screateMessage,
    sgetMessages,
    getstuobj,
    getdocobj
};
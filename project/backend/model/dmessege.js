const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'doctor',
        required: true,
    },
    to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userdetails',
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    createdon: {
        type: Date,
        default: Date.now
    }
});

const dmessege = mongoose.model('dmessege', messageSchema);
module.exports = dmessege;
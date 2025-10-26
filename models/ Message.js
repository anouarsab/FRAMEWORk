// models/Message.js
const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    nom: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        match: [/\S+@\S+\.\S+/, 'Veuillez utiliser un format d\'email valide.'] // Validation par regex
    },
    message: {
        type: String,
        required: true,
        maxlength: 2000
    },
    dateEnvoi: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Message', MessageSchema);
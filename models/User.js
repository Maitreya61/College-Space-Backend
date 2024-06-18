const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    likedNotes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Notes'
        }
    ]
});

const User = mongoose.model('User', userSchema);

module.exports = User;

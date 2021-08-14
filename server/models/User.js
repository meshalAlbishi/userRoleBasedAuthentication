const { Schema, model } = require('mongoose');

const userSchema = new Schema({

    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: "user",
        enum: ["user", "admin", "student", "instructor"]
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }

});


module.exports = model('users', userSchema);

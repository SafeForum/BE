const mongoose = require('mongoose');
const user = require('./user');
const Schema = mongoose.Schema;

const passwordSchema = new Schema({
    oldPassword: {
        type: String,
        required: true
    },
    Password: {
        type: String,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model('Password', passwordSchema)
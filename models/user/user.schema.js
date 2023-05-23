const mongoose = require('mongoose');
const video = require('../video/videos.js');
let ObjectId = mongoose.mongo.ObjectId;

const UserSchema = new mongoose.Schema({
    subscribedUsers: [
        {
            type: ObjectId,
            ref: 'Users'
        }
    ],
    login: {
        type: String,
        required: false
    },
    fullname: {
        type: String
    },
    registredAt: {
        type: Date,
        default: Date.now
    },
    avaUrl: {
        type: String,
        default: "/images/defaultPhoto.jpg"
    },
    isDisabled: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        default: "user"
    },
    password: {
        type: String,
        required: false
    },
    videos: [
        {
            type: ObjectId,
            ref: 'Videos'
        }
    ],
    playlists: [
        {
            type: ObjectId,
            ref: 'Playlists'
        }
    ],
    chatId: {
        type: String,
        default: ""
    },
    googleId: {
        type: String,
        default: ""
    }
}, {collection: 'Users'})
module.exports = UserSchema;
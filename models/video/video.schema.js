const mongoose = require('mongoose');
let ObjectId = mongoose.Schema.Types.ObjectId;

const VideosSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    registredAt: {
        type: Date,
        default: Date.now
    },
    imageUrl: {
        type: String
    },
    videoUrl: {
        type: String
    },
    authorId: {
        type: ObjectId,
        ref: 'Users'
    },
    views: [
        {
            type: ObjectId,
            ref: 'Views'
        }
    ]
}, {collection: 'Videos'})
module.exports = VideosSchema;
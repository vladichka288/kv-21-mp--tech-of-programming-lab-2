const mongoose = require('mongoose');
let ObjectId = mongoose.Schema.Types.ObjectId;
const ViewSchema = new mongoose.Schema({
    registredAt: {
        type: Date,
        default: Date.now
    },
    viewerId: {
        type: ObjectId,
        ref: 'Users'
    }
}, {collection: 'Views'})
module.exports = ViewSchema;
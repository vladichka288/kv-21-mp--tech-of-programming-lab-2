const mongoose = require("mongoose");
let ObjectId = mongoose.mongo.ObjectId;

const PlaylistSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    registredAt: {
      type: Date,
      default: Date.now,
    },
    authorId: {
      type: ObjectId,
      ref: "Users",
    },
    videosId: [
      {
        type: ObjectId,
        ref: "Videos",
      },
    ],
    description: {
      type: String,
    },
  },
  { collection: "Playlists" }
);
module.exports = PlaylistSchema;

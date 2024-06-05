const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const candidateSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
    },
    photo: {
      type: String,
    },
    voteCount: {
      type: Number,
      default: 0,
    },
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Candidate", candidateSchema);

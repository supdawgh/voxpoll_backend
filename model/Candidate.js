const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const candidateSchema = new Schema({
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
  eventId: {
    type: Schema.Types.ObjectId,
    ref: "Event",
  },
});

module.exports = mongoose.model("Candidate", candidateSchema);

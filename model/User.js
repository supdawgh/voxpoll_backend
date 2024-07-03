const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    roles: {
      type: [String],
      required: true,
      enum: ["voter", "admin"],
    },
    citizenship: {
      type: String,
    },
    RPP: {
      type: String,
    },
    votes: {
      type: [Schema.Types.ObjectId],
      ref: "Candidate",
    },
    votedEvents: {
      type: [Schema.Types.ObjectId],
      ref: "Event",
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const eventSchema = new Schema(
  {
    eventName: {
      type: String,
      required: true,
    },
    eventType: {
      type: String,
      required: true,
    },
    eventDescription: {
      type: String,
    },
    eventStatus: {
      type: String,
      default: "unverified",
    },
    eventBanner: {
      type: String,
    },
    eventStartDate: {
      type: Date,
    },
    eventEndDate: {
      type: Date,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    candidates: [
      {
        type: Schema.Types.ObjectId,
        ref: "Candidate",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);

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
    eventBanner: {
      type: String,
    },
    eventEndDate: {
      type: Date,
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

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const documentSchema = new Schema(
  {
    imageUrl: {
      type: String,
      required: true,
    },
    citizenshipNumber: {
      type: String,
      unique: true,
    },
    rastriyaPrarichayaPatraNumber: {
      type: String,
      unique: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Document", documentSchema);

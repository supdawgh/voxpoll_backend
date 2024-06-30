const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const documentSchema = new Schema(
  {
    fileName: {
      type: String,
    },
    filePath: {
      type: String,
    },
    citizenshipNumber: {
      type: String,
      unique: true
    },
    rastriyaPrarichayaPatraNumber: {
      type: String,
      unique: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Document", documentSchema);

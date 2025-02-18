const mongoose = require("mongoose");

const SubjectSchema = new mongoose.Schema({
  name: String,
  code: String,
  professor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  qrCode: String, 
});

module.exports = mongoose.model("Subject", SubjectSchema);

const mongoose = require("mongoose");

const AttendanceSchema = new mongoose.Schema({
  subject: { type: mongoose.Schema.Types.ObjectId, ref: "Subject" },
  sessionId: String, 
  professor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  studentsPresent: [
    {
      student: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      timestamp: { type: Date, default: Date.now },
    },
  ],
  status: { type: String, enum: ["active", "closed"], default: "active" },
});

module.exports = mongoose.model("Attendance", AttendanceSchema);

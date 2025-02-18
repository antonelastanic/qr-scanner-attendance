const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Subject = require("../models/Subject");
const Attendance = require("../models/Attendance");

// Professor scans QR → Start/End session
router.post("/professor", async (req, res) => {
  const { userId, subjectCode } = req.body;

  try {
    const professor = await User.findById(userId);
    if (!professor || professor.role !== "professor") {
      return res.status(403).json({ error: "Unauthorized. Only professors can start sessions." });
    }

    const subject = await Subject.findOne({ code: subjectCode });
    if (!subject) {
      return res.status(404).json({ error: "Subject not found." });
    }

    // Check if a session is already active
    let session = await Attendance.findOne({ subject: subject._id, status: "active" });

    if (session) {
      session.status = "closed"; // End session
      await session.save();
      return res.json({ message: `Session for ${subject.name} ended.` });
    } else {
      // Start new session
      const newSession = new Attendance({
        subject: subject._id,
        sessionId: `${subject.code}-${new Date().toISOString()}`,
        professor: professor._id,
        status: "active",
      });

      await newSession.save();
      return res.json({ message: `Session for ${subject.name} started.` });
    }
  } catch (err) {
    res.status(500).json({ error: "Server error." });
  }
});

// Student scans QR → Record attendance
router.post("/student", async (req, res) => {
  const { userId, subjectCode } = req.body;

  try {
    const student = await User.findById(userId);
    if (!student || student.role !== "student") {
      return res.status(403).json({ error: "Unauthorized. Only students can check in." });
    }

    const subject = await Subject.findOne({ code: subjectCode });
    if (!subject) {
      return res.status(404).json({ error: "Subject not found." });
    }

    let session = await Attendance.findOne({ subject: subject._id, status: "active" });

    if (!session) {
      return res.status(400).json({ error: "No active session for this subject." });
    }

    // Prevent duplicate attendance
    const alreadyCheckedIn = session.studentsPresent.some(s => s.student.toString() === student._id.toString());
    if (alreadyCheckedIn) {
      return res.status(400).json({ error: "Student already checked in." });
    }

    session.studentsPresent.push({ student: student._id });
    await session.save();

    return res.json({ message: `Student ${student.name} checked in for ${subject.name}.` });
  } catch (err) {
    res.status(500).json({ error: "Server error." });
  }
});

module.exports = router;

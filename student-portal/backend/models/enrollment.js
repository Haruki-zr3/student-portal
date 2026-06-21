const mongoose = require('mongoose')

const enrollmentSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  attendance: { type: Number, default: 0 },
  grade: {
    marks: { type: Number },
    letter: { type: String },
  },
}, { timestamps: true })

module.exports = mongoose.model('Enrollment', enrollmentSchema)
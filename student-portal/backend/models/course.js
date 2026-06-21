const mongoose = require('mongoose')

const courseSchema = new mongoose.Schema({
  courseCode: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  instructor: { type: String, required: true },
  schedule: { type: String },
  credits: { type: Number, default: 3 },
}, { timestamps: true })

module.exports = mongoose.model('Course', courseSchema)
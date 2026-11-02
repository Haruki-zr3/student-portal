const express = require('express')
const router = express.Router()
const Enrollment = require('../models/enrollment')
const User = require('../models/user')
const Course = require('../models/course')

router.get('/', async (req, res) => {
  try {
    const [students, courses] = await Promise.all([
      User.find({ role: 'student' }).select('_id'),
      Course.find().select('_id'),
    ])

    const existingEnrollments = await Enrollment.find().select('studentId courseId')
    const existingPairs = new Set(
      existingEnrollments.map((enrollment) => `${enrollment.studentId}:${enrollment.courseId}`)
    )
    const missingEnrollments = []

    for (const student of students) {
      for (const course of courses) {
        if (!existingPairs.has(`${student._id}:${course._id}`)) {
          missingEnrollments.push({
            studentId: student._id,
            courseId: course._id,
            attendance: 0,
            classesAttended: 0,
            totalClasses: 0,
            grade: { letter: '' },
          })
        }
      }
    }

    if (missingEnrollments.length > 0) {
      await Enrollment.insertMany(missingEnrollments)
    }

    const enrollments = await Enrollment.find()
      .populate('studentId', 'name studentId')
      .populate('courseId', 'title courseCode instructor schedule credits')
    res.json(enrollments)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.post('/', async (req, res) => {
  try {
    const enrollment = await Enrollment.create(req.body)
    res.status(201).json(enrollment)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.put('/:id', async (req, res) => {
  try {
    const payload = { ...req.body }
    if (payload.classesAttended !== undefined || payload.totalClasses !== undefined) {
      const attended = Number(payload.classesAttended ?? 0)
      const total = Number(payload.totalClasses ?? 0)
      payload.attendance = total > 0 ? (attended / total) * 100 : 0
    } else if (payload.attendance !== undefined) {
      payload.attendance = Number(payload.attendance)
    }

    const updated = await Enrollment.findByIdAndUpdate(req.params.id, payload, { new: true })
    res.json(updated)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router
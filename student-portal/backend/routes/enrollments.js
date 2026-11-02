const express = require('express')
const router = express.Router()
const Enrollment = require('../models/enrollment')

router.get('/', async (req, res) => {
  try {
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
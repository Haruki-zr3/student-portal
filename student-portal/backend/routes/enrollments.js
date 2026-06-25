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
    const updated = await Enrollment.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json(updated)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router
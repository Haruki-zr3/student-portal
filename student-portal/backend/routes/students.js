const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const User = require('../models/user')

// Get all students (admin)
router.get('/', async (req, res) => {
  try {
    const students = await User.find({ role: 'student' }).select('-password')
    res.json(students)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Create student (admin)
router.post('/', async (req, res) => {
  try {
    const { name, email, password, studentId } = req.body
    const hashedPassword = await bcrypt.hash(password, 10)
    const student = await User.create({
      name, email, password: hashedPassword, studentId, role: 'student'
    })
    res.status(201).json({ id: student._id, name: student.name, email: student.email })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router
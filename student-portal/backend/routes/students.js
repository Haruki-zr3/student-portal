const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const User = require('../models/user')
const Course = require('../models/course')
const Enrollment = require('../models/enrollment')

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
  let student
  try {
    const { name, email, password, studentId, department } = req.body
    if (!password) {
      return res.status(400).json({ message: 'A password is required for a new student' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    student = await User.create({
      name, email, password: hashedPassword, studentId, department, role: 'student'
    })

    const courses = await Course.find().select('_id')
    if (courses.length > 0) {
      await Enrollment.insertMany(courses.map((course) => ({
        studentId: student._id,
        courseId: course._id,
        attendance: 0,
        classesAttended: 0,
        totalClasses: 0,
        grade: { marks: undefined, letter: '' },
      })))
    }

    res.status(201).json({
      _id: student._id,
      studentId: student.studentId,
      name: student.name,
      email: student.email,
      department: student.department,
    })
  } catch (err) {
    if (student) {
      await User.findByIdAndDelete(student._id)
    }
    res.status(500).json({ message: err.message })
  }
})

router.put('/:id', async (req, res) => {
  try {
    const { name, email, studentId, department, password } = req.body
    const updates = { name, email, studentId, department }
    if (password) {
      updates.password = await bcrypt.hash(password, 10)
    }

    const updated = await User.findOneAndUpdate(
      { _id: req.params.id, role: 'student' },
      updates,
      { new: true, runValidators: true }
    ).select('-password')

    if (!updated) {
      return res.status(404).json({ message: 'Student not found' })
    }

    res.json(updated)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router
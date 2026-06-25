require('dotenv').config()
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const User = require('./models/user')
const Course = require('./models/course')
const Enrollment = require('./models/enrollment')

async function seed() {
  await mongoose.connect(process.env.MONGO_URI)
  console.log('Connected to MongoDB')

  await User.deleteMany({})
  await Course.deleteMany({})
  await Enrollment.deleteMany({})

  const adminPassword = await bcrypt.hash('admin123', 10)
  await User.create({
    name: 'Admin User',
    email: 'admin@university.edu',
    password: adminPassword,
    role: 'admin',
  })

  const studentPassword = await bcrypt.hash('student123', 10)
  const student = await User.create({
    name: 'Harsh Singh',
    email: 'haruki@university.edu',
    password: studentPassword,
    role: 'student',
    studentId: 'STU2024001',
  })

  const courses = await Course.insertMany([
    { courseCode: 'CS301', title: 'Data Structures', instructor: 'Dr. Mehta', schedule: 'Mon/Wed 10:00 AM', credits: 4 },
    { courseCode: 'CS302', title: 'Operating Systems', instructor: 'Dr. Singh', schedule: 'Tue/Thu 11:00 AM', credits: 4 },
    { courseCode: 'CS303', title: 'Database Management', instructor: 'Dr. Verma', schedule: 'Mon/Fri 9:00 AM', credits: 3 },
    { courseCode: 'CS304', title: 'Computer Networks', instructor: 'Dr. Rao', schedule: 'Wed/Fri 2:00 PM', credits: 3 },
    { courseCode: 'CS305', title: 'Web Technologies', instructor: 'Dr. Gupta', schedule: 'Tue/Thu 3:00 PM', credits: 4 },
  ])

  const enrollmentData = [
    { marks: 87, letter: 'A', attendance: 85 },
    { marks: 79, letter: 'B+', attendance: 79 },
    { marks: 92, letter: 'A+', attendance: 89 },
    { marks: 74, letter: 'B', attendance: 75 },
    { marks: 88, letter: 'A', attendance: 90 },
  ]

  for (let i = 0; i < courses.length; i++) {
    await Enrollment.create({
      studentId: student._id,
      courseId: courses[i]._id,
      attendance: enrollmentData[i].attendance,
      grade: { marks: enrollmentData[i].marks, letter: enrollmentData[i].letter },
    })
  }

  console.log('Seed data created successfully')
  console.log('Admin login: admin@university.edu / admin123')
  console.log('Student login: haruki@university.edu / student123')

  mongoose.disconnect()
}

seed()
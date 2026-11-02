import { useEffect, useState } from 'react'
import PortalSidebar from '../components/PortalSidebar'

const emptyCourseForm = {
  courseCode: '',
  title: '',
  instructor: '',
  schedule: '',
  credits: '3',
}

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('students')
  const [students, setStudents] = useState([])
  const [courses, setCourses] = useState([])
  const [enrollments, setEnrollments] = useState([])
  const [loading, setLoading] = useState(true)
  const [studentForm, setStudentForm] = useState({ id: '', name: '', email: '', department: '', password: '' })
  const [editingStudentId, setEditingStudentId] = useState(null)
  const [courseForm, setCourseForm] = useState(emptyCourseForm)
  const [editingCourseId, setEditingCourseId] = useState(null)

  useEffect(() => {
    async function loadData() {
      try {
        const [studentsRes, coursesRes, enrollmentsRes] = await Promise.all([
          fetch('/api/students'),
          fetch('/api/courses'),
          fetch('/api/enrollments'),
        ])

        const studentsData = await studentsRes.json()
        const coursesData = await coursesRes.json()
        const enrollmentsData = await enrollmentsRes.json()

        setStudents(studentsData)
        setCourses(coursesData)
        setEnrollments(enrollmentsData)
      } catch (error) {
        console.error('Failed to load admin data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  async function saveStudent(e) {
    e.preventDefault()
    if (!studentForm.id || !studentForm.name) return

    const payload = {
      studentId: studentForm.id.trim(),
      name: studentForm.name.trim(),
      email: studentForm.email.trim(),
      department: studentForm.department.trim(),
    }
    if (studentForm.password) {
      payload.password = studentForm.password
    }

    try {
      const res = await fetch(editingStudentId ? `/api/students/${editingStudentId}` : '/api/students', {
        method: editingStudentId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const savedStudent = await res.json()
      if (!res.ok) {
        throw new Error(savedStudent.message || 'Failed to save student')
      }

      setStudents((prev) => editingStudentId
        ? prev.map((student) => (student._id === editingStudentId ? savedStudent : student))
        : [...prev, savedStudent])
      const enrollmentsRes = await fetch('/api/enrollments')
      if (enrollmentsRes.ok) {
        setEnrollments(await enrollmentsRes.json())
      }
      setStudentForm({ id: '', name: '', email: '', department: '', password: '' })
      setEditingStudentId(null)
    } catch (error) {
      console.error('Failed to save student:', error)
    }
  }

  function startEditStudent(student) {
    setEditingStudentId(student._id)
    setStudentForm({
      id: student.studentId || '',
      name: student.name || '',
      email: student.email || '',
      department: student.department || '',
      password: '',
    })
  }

  async function addCourse(e) {
    e.preventDefault()
    if (!courseForm.courseCode || !courseForm.title || !courseForm.instructor) return

    const payload = {
      courseCode: courseForm.courseCode.trim(),
      title: courseForm.title.trim(),
      instructor: courseForm.instructor.trim(),
      schedule: courseForm.schedule || 'TBA',
      credits: Number(courseForm.credits) || 3,
    }

    try {
      if (editingCourseId) {
        const res = await fetch(`/api/courses/${editingCourseId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })

        const updated = await res.json()
        setCourses((prev) => prev.map((course) => (course._id === editingCourseId ? updated : course)))
      } else {
        const res = await fetch('/api/courses', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })

        const created = await res.json()
        setCourses((prev) => [...prev, created])
      }

      setCourseForm(emptyCourseForm)
      setEditingCourseId(null)
    } catch (error) {
      console.error('Failed to save course:', error)
    }
  }

  function startEditCourse(course) {
    setEditingCourseId(course._id)
    setCourseForm({
      courseCode: course.courseCode || '',
      title: course.title || '',
      instructor: course.instructor || '',
      schedule: course.schedule || '',
      credits: String(course.credits || 3),
    })
    setActiveTab('courses')
  }

  function handleAttendanceChange(enrollmentId, field, value) {
    setEnrollments((prev) => prev.map((enrollment) => {
      if (enrollment._id !== enrollmentId) return enrollment
      return { ...enrollment, [field]: value }
    }))
  }

  async function saveAttendanceRow(enrollment) {
    const attended = Number(enrollment.classesAttended || 0)
    const total = Number(enrollment.totalClasses || 0)
    const payload = {
      classesAttended: attended,
      totalClasses: total,
      attendance: total > 0 ? (attended / total) * 100 : 0,
    }

    try {
      const res = await fetch(`/api/enrollments/${enrollment._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const updated = await res.json()
      setEnrollments((prev) => prev.map((item) => (item._id === enrollment._id ? updated : item)))
    } catch (error) {
      console.error('Failed to update attendance:', error)
    }
  }

  function handleGradeChange(enrollmentId, field, value) {
    setEnrollments((prev) => prev.map((enrollment) => {
      if (enrollment._id !== enrollmentId) return enrollment
      return {
        ...enrollment,
        grade: { ...enrollment.grade, [field]: value },
      }
    }))
  }

  async function saveGradeRow(enrollment) {
    const marks = enrollment.grade?.marks === '' ? '' : Number(enrollment.grade?.marks ?? 0)
    const letter = enrollment.grade?.letter || ''

    try {
      const res = await fetch(`/api/enrollments/${enrollment._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ grade: { marks, letter } }),
      })

      const updated = await res.json()
      setEnrollments((prev) => prev.map((item) => (item._id === enrollment._id ? updated : item)))
    } catch (error) {
      console.error('Failed to update grade:', error)
    }
  }

  const attendanceRows = enrollments.map((enrollment) => {
    const student = students.find((entry) => String(entry._id) === String(enrollment.studentId?._id ?? enrollment.studentId))
    const course = courses.find((entry) => String(entry._id) === String(enrollment.courseId?._id ?? enrollment.courseId))

    const attended = Number(enrollment.classesAttended ?? 0)
    const total = Number(enrollment.totalClasses ?? 0)
    const percent = total > 0 ? (attended / total) * 100 : Number(enrollment.attendance ?? 0)

    return {
      ...enrollment,
      studentName: student?.name || 'Unknown student',
      studentId: student?.studentId || student?.id || 'N/A',
      courseCode: course?.courseCode || 'N/A',
      courseTitle: course?.title || 'Unknown course',
      attended,
      total,
      percent,
    }
  })

  if (loading) {
    return <div style={{ padding: 40 }}>Loading admin data...</div>
  }

  return (
    <div className="portal-shell" style={styles.container}>
      <PortalSidebar activePath="/admin" isAdmin />

      <div className="portal-main" style={styles.main}>
        <h1 style={styles.heading}>Admin Panel</h1>
        <p style={styles.subheading}>Manage students, courses, attendance, and grades</p>

        <div style={styles.tabs}>
          <button type="button" style={{ ...styles.tab, ...(activeTab === 'students' ? styles.tabActive : {}) }} onClick={() => setActiveTab('students')}>
            Students
          </button>
          <button type="button" style={{ ...styles.tab, ...(activeTab === 'courses' ? styles.tabActive : {}) }} onClick={() => setActiveTab('courses')}>
            Courses
          </button>
          <button type="button" style={{ ...styles.tab, ...(activeTab === 'attendance' ? styles.tabActive : {}) }} onClick={() => setActiveTab('attendance')}>
            Attendance
          </button>
          <button type="button" style={{ ...styles.tab, ...(activeTab === 'grades' ? styles.tabActive : {}) }} onClick={() => setActiveTab('grades')}>
            Grades
          </button>
        </div>

        {activeTab === 'students' && (
          <div className="glass-card" style={styles.panel}>
            <form style={styles.form} onSubmit={saveStudent}>
              <input style={styles.input} placeholder="Student ID" value={studentForm.id} onChange={(e) => setStudentForm({ ...studentForm, id: e.target.value })} />
              <input style={styles.input} placeholder="Full Name" value={studentForm.name} onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })} />
              <input style={styles.input} placeholder="Email" value={studentForm.email} onChange={(e) => setStudentForm({ ...studentForm, email: e.target.value })} />
              <input style={styles.input} placeholder="Department" value={studentForm.department} onChange={(e) => setStudentForm({ ...studentForm, department: e.target.value })} />
              <input style={styles.input} type="password" placeholder={editingStudentId ? 'New Password (optional)' : 'Password'} value={studentForm.password} onChange={(e) => setStudentForm({ ...studentForm, password: e.target.value })} required={!editingStudentId} />
              <button style={styles.addBtn} type="submit">{editingStudentId ? 'Save Student' : '+ Add Student'}</button>
              {editingStudentId && (
                <button type="button" style={styles.secondaryBtn} onClick={() => { setEditingStudentId(null); setStudentForm({ id: '', name: '', email: '', department: '', password: '' }) }}>
                  Cancel
                </button>
              )}
            </form>

            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeader}>
                  <th style={styles.th}>ID</th>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Email</th>
                  <th style={styles.th}>Department</th>
                  <th style={styles.th}>Action</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student._id || student.studentId || student.email} style={styles.tableRow}>
                    <td style={styles.td}>{student.studentId || student.id}</td>
                    <td style={styles.td}>{student.name}</td>
                    <td style={styles.td}>{student.email}</td>
                    <td style={styles.td}>{student.department || '—'}</td>
                    <td style={styles.td}>
                      <button type="button" style={styles.editBtn} onClick={() => startEditStudent(student)}>Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'courses' && (
          <div className="glass-card" style={styles.panel}>
            <form style={styles.form} onSubmit={addCourse}>
              <input style={styles.input} placeholder="Course Code" value={courseForm.courseCode} onChange={(e) => setCourseForm({ ...courseForm, courseCode: e.target.value })} />
              <input style={styles.input} placeholder="Course Title" value={courseForm.title} onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })} />
              <input style={styles.input} placeholder="Instructor" value={courseForm.instructor} onChange={(e) => setCourseForm({ ...courseForm, instructor: e.target.value })} />
              <input style={styles.input} placeholder="Schedule" value={courseForm.schedule} onChange={(e) => setCourseForm({ ...courseForm, schedule: e.target.value })} />
              <input style={styles.input} placeholder="Credits" value={courseForm.credits} onChange={(e) => setCourseForm({ ...courseForm, credits: e.target.value })} />
              <button style={styles.addBtn} type="submit">{editingCourseId ? 'Save Course' : '+ Add Course'}</button>
              {editingCourseId && (
                <button type="button" style={styles.secondaryBtn} onClick={() => { setEditingCourseId(null); setCourseForm(emptyCourseForm) }}>
                  Cancel
                </button>
              )}
            </form>

            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeader}>
                  <th style={styles.th}>Code</th>
                  <th style={styles.th}>Title</th>
                  <th style={styles.th}>Instructor</th>
                  <th style={styles.th}>Schedule</th>
                  <th style={styles.th}>Credits</th>
                  <th style={styles.th}>Action</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course) => (
                  <tr key={course._id || course.courseCode} style={styles.tableRow}>
                    <td style={styles.td}>{course.courseCode}</td>
                    <td style={styles.td}>{course.title}</td>
                    <td style={styles.td}>{course.instructor}</td>
                    <td style={styles.td}>{course.schedule || 'TBA'}</td>
                    <td style={styles.td}>{course.credits || 3}</td>
                    <td style={styles.td}>
                      <button type="button" style={styles.editBtn} onClick={() => startEditCourse(course)}>Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'attendance' && (
          <div className="glass-card" style={styles.panel}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeader}>
                  <th style={styles.th}>Student</th>
                  <th style={styles.th}>Course</th>
                  <th style={styles.th}>Attended</th>
                  <th style={styles.th}>Total Classes</th>
                  <th style={styles.th}>Percentage</th>
                  <th style={styles.th}>Action</th>
                </tr>
              </thead>
              <tbody>
                {attendanceRows.map((row) => (
                  <tr key={row._id} style={styles.tableRow}>
                    <td style={styles.td}>{row.studentId} · {row.studentName}</td>
                    <td style={styles.td}>{row.courseCode} · {row.courseTitle}</td>
                    <td style={styles.td}>
                      <input
                        style={styles.inputSmall}
                        type="number"
                        min="0"
                        value={row.classesAttended || 0}
                        onChange={(e) => handleAttendanceChange(row._id, 'classesAttended', e.target.value)}
                      />
                    </td>
                    <td style={styles.td}>
                      <input
                        style={styles.inputSmall}
                        type="number"
                        min="0"
                        value={row.totalClasses || 0}
                        onChange={(e) => handleAttendanceChange(row._id, 'totalClasses', e.target.value)}
                      />
                    </td>
                    <td style={styles.td}>{Math.min(100, Math.max(0, Number(row.percent || 0))).toFixed(1)}%</td>
                    <td style={styles.td}>
                      <button type="button" style={styles.editBtn} onClick={() => saveAttendanceRow(row)}>Save</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'grades' && (
          <div className="glass-card" style={styles.panel}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeader}>
                  <th style={styles.th}>Student</th>
                  <th style={styles.th}>Course</th>
                  <th style={styles.th}>Marks</th>
                  <th style={styles.th}>Grade</th>
                  <th style={styles.th}>Action</th>
                </tr>
              </thead>
              <tbody>
                {attendanceRows.map((row) => (
                  <tr key={row._id} style={styles.tableRow}>
                    <td style={styles.td}>{row.studentId} · {row.studentName}</td>
                    <td style={styles.td}>{row.courseCode} · {row.courseTitle}</td>
                    <td style={styles.td}>
                      <input
                        style={styles.inputSmall}
                        type="number"
                        min="0"
                        max="100"
                        value={row.grade?.marks ?? ''}
                        onChange={(e) => handleGradeChange(row._id, 'marks', e.target.value)}
                      />
                    </td>
                    <td style={styles.td}>
                      <input
                        style={styles.inputSmall}
                        maxLength="3"
                        value={row.grade?.letter ?? ''}
                        onChange={(e) => handleGradeChange(row._id, 'letter', e.target.value.toUpperCase())}
                      />
                    </td>
                    <td style={styles.td}>
                      <button type="button" style={styles.editBtn} onClick={() => saveGradeRow(row)}>Save</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

const styles = {
  container: { display: 'flex', height: '100vh', fontFamily: 'sans-serif' },
  main: { flex: 1, backgroundColor: '#f0f2f5', padding: '32px', overflowY: 'auto' },
  heading: { fontSize: '24px', color: '#1a1a2e', marginBottom: '4px' },
  subheading: { fontSize: '14px', color: '#666', marginBottom: '24px' },
  tabs: { display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' },
  tab: {
    padding: '8px 18px', backgroundColor: '#fff', borderRadius: '6px',
    fontSize: '14px', cursor: 'pointer', color: '#555', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', border: 'none',
  },
  tabActive: { backgroundColor: '#4f46e5', color: '#fff' },
  panel: { backgroundColor: '#fff', borderRadius: '10px', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' },
  form: { display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' },
  input: {
    flex: '1 1 160px', padding: '9px 12px', borderRadius: '6px',
    border: '1px solid #ddd', fontSize: '13px', outline: 'none',
  },
  inputSmall: {
    width: '84px', padding: '8px 10px', borderRadius: '6px',
    border: '1px solid #ddd', fontSize: '13px', outline: 'none',
  },
  addBtn: {
    padding: '9px 18px', backgroundColor: '#4f46e5', color: '#fff',
    border: 'none', borderRadius: '6px', fontSize: '13px', cursor: 'pointer',
  },
  secondaryBtn: {
    padding: '9px 18px', backgroundColor: '#e5e7eb', color: '#1f2937',
    border: 'none', borderRadius: '6px', fontSize: '13px', cursor: 'pointer',
  },
  editBtn: {
    padding: '7px 12px', backgroundColor: '#eef2ff', color: '#3730a3',
    border: 'none', borderRadius: '6px', fontSize: '12px', cursor: 'pointer',
  },
  table: { width: '100%', borderCollapse: 'collapse' },
  tableHeader: { backgroundColor: '#f8f9fa' },
  th: { padding: '10px 14px', textAlign: 'left', fontSize: '13px', color: '#555', fontWeight: '600' },
  tableRow: { borderTop: '1px solid #eee' },
  td: { padding: '10px 14px', fontSize: '14px', color: '#333', verticalAlign: 'middle' },
}
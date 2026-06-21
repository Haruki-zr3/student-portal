import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function AdminPanel() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('students')

  const [students, setStudents] = useState([
    { id: 'STU2024001', name: 'Haruki Sharma', email: 'haruki@university.edu', department: 'CS' },
    { id: 'STU2024002', name: 'Priya Nair', email: 'priya@university.edu', department: 'CS' },
  ])

  const [courses, setCourses] = useState([
    { code: 'CS301', title: 'Data Structures', instructor: 'Dr. Mehta' },
    { code: 'CS302', title: 'Operating Systems', instructor: 'Dr. Singh' },
  ])

  const [studentForm, setStudentForm] = useState({ id: '', name: '', email: '', department: '' })
  const [courseForm, setCourseForm] = useState({ code: '', title: '', instructor: '' })

  function addStudent(e) {
    e.preventDefault()
    if (!studentForm.id || !studentForm.name) return
    setStudents([...students, studentForm])
    setStudentForm({ id: '', name: '', email: '', department: '' })
  }

  function addCourse(e) {
    e.preventDefault()
    if (!courseForm.code || !courseForm.title) return
    setCourses([...courses, courseForm])
    setCourseForm({ code: '', title: '', instructor: '' })
  }

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <div style={styles.sidebarTitle}>Student Portal</div>
        <nav style={styles.nav}>
          <div style={styles.navItem} onClick={() => navigate('/dashboard')}>Dashboard</div>
          <div style={{ ...styles.navItem, ...styles.navActive }}>Admin Panel</div>
        </nav>
        <div style={styles.logoutBtn} onClick={() => navigate('/')}>Logout</div>
      </div>

      {/* Main */}
      <div style={styles.main}>
        <h1 style={styles.heading}>Admin Panel</h1>
        <p style={styles.subheading}>Manage students and courses</p>

        {/* Tabs */}
        <div style={styles.tabs}>
          <div
            style={{ ...styles.tab, ...(activeTab === 'students' ? styles.tabActive : {}) }}
            onClick={() => setActiveTab('students')}
          >
            Students
          </div>
          <div
            style={{ ...styles.tab, ...(activeTab === 'courses' ? styles.tabActive : {}) }}
            onClick={() => setActiveTab('courses')}
          >
            Courses
          </div>
        </div>

        {activeTab === 'students' && (
          <div style={styles.panel}>
            <form style={styles.form} onSubmit={addStudent}>
              <input style={styles.input} placeholder="Student ID" value={studentForm.id}
                onChange={(e) => setStudentForm({ ...studentForm, id: e.target.value })} />
              <input style={styles.input} placeholder="Full Name" value={studentForm.name}
                onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })} />
              <input style={styles.input} placeholder="Email" value={studentForm.email}
                onChange={(e) => setStudentForm({ ...studentForm, email: e.target.value })} />
              <input style={styles.input} placeholder="Department" value={studentForm.department}
                onChange={(e) => setStudentForm({ ...studentForm, department: e.target.value })} />
              <button style={styles.addBtn} type="submit">+ Add Student</button>
            </form>

            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeader}>
                  <th style={styles.th}>ID</th>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Email</th>
                  <th style={styles.th}>Department</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr key={s.id} style={styles.tableRow}>
                    <td style={styles.td}>{s.id}</td>
                    <td style={styles.td}>{s.name}</td>
                    <td style={styles.td}>{s.email}</td>
                    <td style={styles.td}>{s.department}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'courses' && (
          <div style={styles.panel}>
            <form style={styles.form} onSubmit={addCourse}>
              <input style={styles.input} placeholder="Course Code" value={courseForm.code}
                onChange={(e) => setCourseForm({ ...courseForm, code: e.target.value })} />
              <input style={styles.input} placeholder="Course Title" value={courseForm.title}
                onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })} />
              <input style={styles.input} placeholder="Instructor" value={courseForm.instructor}
                onChange={(e) => setCourseForm({ ...courseForm, instructor: e.target.value })} />
              <button style={styles.addBtn} type="submit">+ Add Course</button>
            </form>

            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeader}>
                  <th style={styles.th}>Code</th>
                  <th style={styles.th}>Title</th>
                  <th style={styles.th}>Instructor</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((c) => (
                  <tr key={c.code} style={styles.tableRow}>
                    <td style={styles.td}>{c.code}</td>
                    <td style={styles.td}>{c.title}</td>
                    <td style={styles.td}>{c.instructor}</td>
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
  sidebar: {
    width: '220px', backgroundColor: '#1a1a2e', color: '#fff',
    display: 'flex', flexDirection: 'column', padding: '24px 0',
  },
  sidebarTitle: { fontSize: '18px', fontWeight: 'bold', padding: '0 24px 24px', borderBottom: '1px solid #333' },
  nav: { flex: 1, marginTop: '16px' },
  navItem: { padding: '12px 24px', cursor: 'pointer', fontSize: '14px', color: '#ccc' },
  navActive: { backgroundColor: '#4f46e5', color: '#fff' },
  logoutBtn: { padding: '12px 24px', cursor: 'pointer', fontSize: '14px', color: '#f87171' },
  main: { flex: 1, backgroundColor: '#f0f2f5', padding: '32px', overflowY: 'auto' },
  heading: { fontSize: '24px', color: '#1a1a2e', marginBottom: '4px' },
  subheading: { fontSize: '14px', color: '#666', marginBottom: '24px' },
  tabs: { display: 'flex', gap: '8px', marginBottom: '20px' },
  tab: {
    padding: '8px 18px', backgroundColor: '#fff', borderRadius: '6px',
    fontSize: '14px', cursor: 'pointer', color: '#555', boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
  },
  tabActive: { backgroundColor: '#4f46e5', color: '#fff' },
  panel: { backgroundColor: '#fff', borderRadius: '10px', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' },
  form: { display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' },
  input: {
    flex: '1 1 160px', padding: '9px 12px', borderRadius: '6px',
    border: '1px solid #ddd', fontSize: '13px', outline: 'none',
  },
  addBtn: {
    padding: '9px 18px', backgroundColor: '#4f46e5', color: '#fff',
    border: 'none', borderRadius: '6px', fontSize: '13px', cursor: 'pointer',
  },
  table: { width: '100%', borderCollapse: 'collapse' },
  tableHeader: { backgroundColor: '#f8f9fa' },
  th: { padding: '10px 14px', textAlign: 'left', fontSize: '13px', color: '#555', fontWeight: '600' },
  tableRow: { borderTop: '1px solid #eee' },
  td: { padding: '10px 14px', fontSize: '14px', color: '#333' },
}
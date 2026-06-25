import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
  const navigate = useNavigate()
  const [student, setStudent] = useState(null)
  const [enrollments, setEnrollments] = useState([])
  const [loading, setLoading] = useState(true)

  const token = localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  useEffect(() => {
    if (!token) { navigate('/'); return }

    async function fetchData() {
      try {
        const res = await fetch('http://localhost:5000/api/enrollments', {
          headers: { Authorization: `Bearer ${token}` }
        })
        const data = await res.json()
        // Filter enrollments for this student
        const mine = data.filter(e => e.studentId?._id === user.id)
        setEnrollments(mine)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/')
  }

  const avgAttendance = enrollments.length
    ? Math.round(enrollments.reduce((s, e) => s + e.attendance, 0) / enrollments.length)
    : 0

  const avgMarks = enrollments.length
    ? Math.round(enrollments.reduce((s, e) => s + (e.grade?.marks || 0), 0) / enrollments.length)
    : 0

  const gpa = (avgMarks / 10).toFixed(1)

  if (loading) return <div style={{ padding: 40 }}>Loading...</div>

  return (
    <div style={styles.container}>
      <div style={styles.sidebar}>
        <div style={styles.sidebarTitle}>Student Portal</div>
        <nav style={styles.nav}>
          <div style={{ ...styles.navItem, ...styles.navActive }}>Dashboard</div>
          <div style={styles.navItem} onClick={() => navigate('/courses')}>Courses</div>
          <div style={styles.navItem} onClick={() => navigate('/grades')}>Grades</div>
          <div style={styles.navItem} onClick={() => navigate('/attendance')}>Attendance</div>
        </nav>
        <div style={styles.logoutBtn} onClick={logout}>Logout</div>
      </div>

      <div style={styles.main}>
        <div style={styles.header}>
          <h1 style={styles.heading}>Welcome, {user.name}</h1>
          <p style={styles.subheading}>Student ID: {user.studentId} · Computer Science · 4th Semester</p>
        </div>

        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={{ ...styles.statValue, color: '#4f46e5' }}>{gpa}</div>
            <div style={styles.statLabel}>GPA</div>
          </div>
          <div style={styles.statCard}>
            <div style={{ ...styles.statValue, color: '#16a34a' }}>{avgAttendance}%</div>
            <div style={styles.statLabel}>Attendance</div>
          </div>
          <div style={styles.statCard}>
            <div style={{ ...styles.statValue, color: '#d97706' }}>{enrollments.length}</div>
            <div style={styles.statLabel}>Courses</div>
          </div>
          <div style={styles.statCard}>
            <div style={{ ...styles.statValue, color: '#dc2626' }}>{enrollments.reduce((s, e) => s + (e.courseId?.credits || 0), 0)}</div>
            <div style={styles.statLabel}>Credits</div>
          </div>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Enrolled Courses</h2>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeader}>
                <th style={styles.th}>Code</th>
                <th style={styles.th}>Course Title</th>
                <th style={styles.th}>Instructor</th>
                <th style={styles.th}>Schedule</th>
              </tr>
            </thead>
            <tbody>
              {enrollments.map((e) => (
                <tr key={e._id} style={styles.tableRow}>
                  <td style={styles.td}>{e.courseId?.courseCode}</td>
                  <td style={styles.td}>{e.courseId?.title}</td>
                  <td style={styles.td}>{e.courseId?.instructor}</td>
                  <td style={styles.td}>{e.courseId?.schedule}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
  main: { flex: 1, backgroundColor: '#f0f2f5', overflowY: 'auto', padding: '32px' },
  header: { marginBottom: '24px' },
  heading: { fontSize: '24px', color: '#1a1a2e' },
  subheading: { fontSize: '14px', color: '#666', marginTop: '4px' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' },
  statCard: {
    backgroundColor: '#fff', borderRadius: '10px', padding: '24px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.08)', textAlign: 'center',
  },
  statValue: { fontSize: '32px', fontWeight: 'bold' },
  statLabel: { fontSize: '13px', color: '#666', marginTop: '4px' },
  section: { backgroundColor: '#fff', borderRadius: '10px', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' },
  sectionTitle: { fontSize: '16px', marginBottom: '16px', color: '#1a1a2e' },
  table: { width: '100%', borderCollapse: 'collapse' },
  tableHeader: { backgroundColor: '#f8f9fa' },
  th: { padding: '10px 14px', textAlign: 'left', fontSize: '13px', color: '#555', fontWeight: '600' },
  tableRow: { borderTop: '1px solid #eee' },
  td: { padding: '10px 14px', fontSize: '14px', color: '#333' },
}
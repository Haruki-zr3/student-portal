import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Attendance() {
  const navigate = useNavigate()
  const [enrollments, setEnrollments] = useState([])
  const [loading, setLoading] = useState(true)

  const token = localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  useEffect(() => {
    if (!token) { navigate('/'); return }

    async function fetchData() {
      try {
        const res = await fetch('/api/enrollments', {
          headers: { Authorization: `Bearer ${token}` }
        })
        const data = await res.json()
        setEnrollments(data.filter(e => e.studentId?._id === user.id))
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const getColor = (pct) => {
    if (pct >= 85) return '#16a34a'
    if (pct >= 75) return '#d97706'
    return '#dc2626'
  }

  const getStatus = (pct) => {
    if (pct >= 85) return 'Good'
    if (pct >= 75) return 'Average'
    return 'Low'
  }

  if (loading) return <div style={{ padding: 40 }}>Loading...</div>

  return (
    <div style={styles.container}>
      <div style={styles.sidebar}>
        <div style={styles.sidebarTitle}>Student Portal</div>
        <nav style={styles.nav}>
          <div style={styles.navItem} onClick={() => navigate('/dashboard')}>Dashboard</div>
          <div style={styles.navItem} onClick={() => navigate('/courses')}>Courses</div>
          <div style={styles.navItem} onClick={() => navigate('/grades')}>Grades</div>
          <div style={{ ...styles.navItem, ...styles.navActive }}>Attendance</div>
        </nav>
        <div style={styles.logoutBtn} onClick={() => { localStorage.clear(); navigate('/') }}>Logout</div>
      </div>

      <div style={styles.main}>
        <h1 style={styles.heading}>Attendance</h1>
        <p style={styles.subheading}>Semester 4 · Academic Year 2025-26</p>

        <div style={styles.section}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeader}>
                <th style={styles.th}>Code</th>
                <th style={styles.th}>Course Title</th>
                <th style={styles.th}>Percentage</th>
                <th style={styles.th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {enrollments.map((e) => {
                const pct = e.attendance
                const color = getColor(pct)
                return (
                  <tr key={e._id} style={styles.tableRow}>
                    <td style={styles.td}>{e.courseId?.courseCode}</td>
                    <td style={styles.td}>{e.courseId?.title}</td>
                    <td style={styles.td}>
                      <div style={styles.barContainer}>
                        <div style={{ ...styles.bar, width: `${pct}%`, backgroundColor: color }} />
                        <span style={{ ...styles.barLabel, color }}>{pct}%</span>
                      </div>
                    </td>
                    <td style={styles.td}>
                      <span style={{ ...styles.badge, color, backgroundColor: color + '18' }}>
                        {getStatus(pct)}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <div style={styles.warning}>
          <strong>⚠ Note:</strong> Minimum 75% attendance required per subject.
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
  main: { flex: 1, backgroundColor: '#f0f2f5', padding: '32px', overflowY: 'auto' },
  heading: { fontSize: '24px', color: '#1a1a2e', marginBottom: '4px' },
  subheading: { fontSize: '14px', color: '#666', marginBottom: '24px' },
  section: { backgroundColor: '#fff', borderRadius: '10px', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', marginBottom: '24px' },
  table: { width: '100%', borderCollapse: 'collapse' },
  tableHeader: { backgroundColor: '#f8f9fa' },
  th: { padding: '10px 14px', textAlign: 'left', fontSize: '13px', color: '#555', fontWeight: '600' },
  tableRow: { borderTop: '1px solid #eee' },
  td: { padding: '10px 14px', fontSize: '14px', color: '#333' },
  barContainer: { display: 'flex', alignItems: 'center', gap: '8px' },
  bar: { height: '8px', borderRadius: '4px', minWidth: '4px' },
  barLabel: { fontSize: '13px', fontWeight: '600', whiteSpace: 'nowrap' },
  badge: { padding: '3px 10px', borderRadius: '12px', fontWeight: '600', fontSize: '13px' },
  warning: {
    backgroundColor: '#fff7ed', border: '1px solid #fed7aa',
    borderRadius: '8px', padding: '14px 18px', fontSize: '14px', color: '#92400e',
  },
}
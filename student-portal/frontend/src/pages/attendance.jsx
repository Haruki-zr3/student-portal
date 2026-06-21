import { useNavigate } from 'react-router-dom'

export default function Attendance() {
  const navigate = useNavigate()

  const attendance = [
    { code: 'CS301', title: 'Data Structures', total: 40, attended: 34 },
    { code: 'CS302', title: 'Operating Systems', total: 38, attended: 30 },
    { code: 'CS303', title: 'Database Management', total: 35, attended: 31 },
    { code: 'CS304', title: 'Computer Networks', total: 36, attended: 27 },
    { code: 'CS305', title: 'Web Technologies', total: 40, attended: 36 },
  ]

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

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <div style={styles.sidebarTitle}>Student Portal</div>
        <nav style={styles.nav}>
          <div style={styles.navItem} onClick={() => navigate('/dashboard')}>Dashboard</div>
          <div style={styles.navItem} onClick={() => navigate('/courses')}>Courses</div>
          <div style={styles.navItem} onClick={() => navigate('/grades')}>Grades</div>
          <div style={{ ...styles.navItem, ...styles.navActive }}>Attendance</div>
        </nav>
        <div style={styles.logoutBtn} onClick={() => navigate('/')}>Logout</div>
      </div>

      {/* Main */}
      <div style={styles.main}>
        <h1 style={styles.heading}>Attendance</h1>
        <p style={styles.subheading}>Semester 4 · Academic Year 2025-26</p>

        <div style={styles.section}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeader}>
                <th style={styles.th}>Code</th>
                <th style={styles.th}>Course Title</th>
                <th style={styles.th}>Attended</th>
                <th style={styles.th}>Total</th>
                <th style={styles.th}>Percentage</th>
                <th style={styles.th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {attendance.map((a) => {
                const pct = Math.round((a.attended / a.total) * 100)
                const color = getColor(pct)
                return (
                  <tr key={a.code} style={styles.tableRow}>
                    <td style={styles.td}>{a.code}</td>
                    <td style={styles.td}>{a.title}</td>
                    <td style={styles.td}>{a.attended}</td>
                    <td style={styles.td}>{a.total}</td>
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

        {/* Warning */}
        <div style={styles.warning}>
          <strong>⚠ Note:</strong> Minimum 75% attendance required per subject. Students below this threshold may be barred from exams.
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
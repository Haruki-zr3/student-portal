import { useNavigate } from 'react-router-dom'

export default function Grades() {
  const navigate = useNavigate()

  const grades = [
    { code: 'CS301', title: 'Data Structures', marks: 87, letter: 'A', credits: 4 },
    { code: 'CS302', title: 'Operating Systems', marks: 79, letter: 'B+', credits: 4 },
    { code: 'CS303', title: 'Database Management', marks: 92, letter: 'A+', credits: 3 },
    { code: 'CS304', title: 'Computer Networks', marks: 74, letter: 'B', credits: 3 },
    { code: 'CS305', title: 'Web Technologies', marks: 88, letter: 'A', credits: 4 },
  ]

  const gradeColor = (letter) => {
    if (letter.startsWith('A')) return '#16a34a'
    if (letter.startsWith('B')) return '#d97706'
    return '#dc2626'
  }

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <div style={styles.sidebarTitle}>Student Portal</div>
        <nav style={styles.nav}>
          <div style={styles.navItem} onClick={() => navigate('/dashboard')}>Dashboard</div>
          <div style={styles.navItem} onClick={() => navigate('/courses')}>Courses</div>
          <div style={{ ...styles.navItem, ...styles.navActive }}>Grades</div>
          <div style={styles.navItem} onClick={() => navigate('/attendance')}>Attendance</div>
        </nav>
        <div style={styles.logoutBtn} onClick={() => navigate('/')}>Logout</div>
      </div>

      {/* Main */}
      <div style={styles.main}>
        <h1 style={styles.heading}>Grades</h1>
        <p style={styles.subheading}>Semester 4 · Academic Year 2025-26</p>

        <div style={styles.section}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeader}>
                <th style={styles.th}>Code</th>
                <th style={styles.th}>Course Title</th>
                <th style={styles.th}>Credits</th>
                <th style={styles.th}>Marks</th>
                <th style={styles.th}>Grade</th>
              </tr>
            </thead>
            <tbody>
              {grades.map((g) => (
                <tr key={g.code} style={styles.tableRow}>
                  <td style={styles.td}>{g.code}</td>
                  <td style={styles.td}>{g.title}</td>
                  <td style={styles.td}>{g.credits}</td>
                  <td style={styles.td}>{g.marks}/100</td>
                  <td style={styles.td}>
                    <span style={{ ...styles.badge, color: gradeColor(g.letter), backgroundColor: gradeColor(g.letter) + '18' }}>
                      {g.letter}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary */}
        <div style={styles.summaryRow}>
          <div style={styles.summaryCard}>
            <div style={styles.summaryValue}>8.6</div>
            <div style={styles.summaryLabel}>Current GPA</div>
          </div>
          <div style={styles.summaryCard}>
            <div style={styles.summaryValue}>18</div>
            <div style={styles.summaryLabel}>Total Credits</div>
          </div>
          <div style={styles.summaryCard}>
            <div style={styles.summaryValue}>84</div>
            <div style={styles.summaryLabel}>Average Marks</div>
          </div>
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
  badge: { padding: '3px 10px', borderRadius: '12px', fontWeight: '600', fontSize: '13px' },
  summaryRow: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' },
  summaryCard: {
    backgroundColor: '#fff', borderRadius: '10px', padding: '24px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.08)', textAlign: 'center',
  },
  summaryValue: { fontSize: '28px', fontWeight: 'bold', color: '#4f46e5' },
  summaryLabel: { fontSize: '13px', color: '#666', marginTop: '4px' },
}
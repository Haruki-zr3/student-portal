import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
  const navigate = useNavigate()

  const student = {
    name: 'Harsh Singh',
    studentId: '24BCS027',
    department: 'Computer Science',
    semester: '4th Semester',
  }

  const stats = [
    { label: 'GPA', value: '8.6', color: '#4f46e5' },
    { label: 'Attendance', value: '82%', color: '#16a34a' },
    { label: 'Courses', value: '5', color: '#d97706' },
    { label: 'Credits', value: '18', color: '#dc2626' },
  ]

  const courses = [
    { code: 'CS301', title: 'Data Structures', instructor: 'Dr. Mehta', schedule: 'Mon/Wed 10:00 AM' },
    { code: 'CS302', title: 'Operating Systems', instructor: 'Dr. Singh', schedule: 'Tue/Thu 11:00 AM' },
    { code: 'CS303', title: 'Database Management', instructor: 'Dr. Verma', schedule: 'Mon/Fri 9:00 AM' },
    { code: 'CS304', title: 'Computer Networks', instructor: 'Dr. Rao', schedule: 'Wed/Fri 2:00 PM' },
    { code: 'CS305', title: 'Web Technologies', instructor: 'Dr. Gupta', schedule: 'Tue/Thu 3:00 PM' },
  ]

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <div style={styles.sidebarTitle}>Student Portal</div>
        <nav style={styles.nav}>
          <div style={{ ...styles.navItem, ...styles.navActive }}>Dashboard</div>
          <div style={styles.navItem} onClick={() => navigate('/courses')}>Courses</div>
          <div style={styles.navItem} onClick={() => navigate('/grades')}>Grades</div>
          <div style={styles.navItem} onClick={() => navigate('/attendance')}>Attendance</div>
        </nav>
        <div style={styles.logoutBtn} onClick={() => navigate('/')}>Logout</div>
      </div>

      {/* Main Content */}
      <div style={styles.main}>
        {/* Header */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.heading}>Welcome, {student.name}</h1>
            <p style={styles.subheading}>{student.studentId} · {student.department} · {student.semester}</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div style={styles.statsGrid}>
          {stats.map((stat) => (
            <div key={stat.label} style={styles.statCard}>
              <div style={{ ...styles.statValue, color: stat.color }}>{stat.value}</div>
              <div style={styles.statLabel}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Courses Table */}
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
              {courses.map((course) => (
                <tr key={course.code} style={styles.tableRow}>
                  <td style={styles.td}>{course.code}</td>
                  <td style={styles.td}>{course.title}</td>
                  <td style={styles.td}>{course.instructor}</td>
                  <td style={styles.td}>{course.schedule}</td>
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
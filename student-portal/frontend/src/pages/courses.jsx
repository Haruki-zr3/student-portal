import { useNavigate } from 'react-router-dom'

export default function Courses() {
  const navigate = useNavigate()

  const courses = [
    { code: 'CS301', title: 'Data Structures', instructor: 'Dr. Mehta', schedule: 'Mon/Wed 10:00 AM', credits: 4, room: 'B-204' },
    { code: 'CS302', title: 'Operating Systems', instructor: 'Dr. Singh', schedule: 'Tue/Thu 11:00 AM', credits: 4, room: 'B-108' },
    { code: 'CS303', title: 'Database Management', instructor: 'Dr. Verma', schedule: 'Mon/Fri 9:00 AM', credits: 3, room: 'A-301' },
    { code: 'CS304', title: 'Computer Networks', instructor: 'Dr. Rao', schedule: 'Wed/Fri 2:00 PM', credits: 3, room: 'B-110' },
    { code: 'CS305', title: 'Web Technologies', instructor: 'Dr. Gupta', schedule: 'Tue/Thu 3:00 PM', credits: 4, room: 'C-202' },
  ]

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <div style={styles.sidebarTitle}>Student Portal</div>
        <nav style={styles.nav}>
          <div style={styles.navItem} onClick={() => navigate('/dashboard')}>Dashboard</div>
          <div style={{ ...styles.navItem, ...styles.navActive }}>Courses</div>
          <div style={styles.navItem} onClick={() => navigate('/grades')}>Grades</div>
          <div style={styles.navItem} onClick={() => navigate('/attendance')}>Attendance</div>
        </nav>
        <div style={styles.logoutBtn} onClick={() => navigate('/')}>Logout</div>
      </div>

      {/* Main */}
      <div style={styles.main}>
        <h1 style={styles.heading}>My Courses</h1>
        <p style={styles.subheading}>Semester 4 · Academic Year 2025-26 · 5 Courses Enrolled</p>

        <div style={styles.grid}>
          {courses.map((c) => (
            <div key={c.code} style={styles.card}>
              <div style={styles.cardHeader}>
                <span style={styles.codeTag}>{c.code}</span>
                <span style={styles.creditsTag}>{c.credits} Credits</span>
              </div>
              <h3 style={styles.cardTitle}>{c.title}</h3>
              <div style={styles.cardRow}>
                <span style={styles.cardLabel}>Instructor</span>
                <span style={styles.cardValue}>{c.instructor}</span>
              </div>
              <div style={styles.cardRow}>
                <span style={styles.cardLabel}>Schedule</span>
                <span style={styles.cardValue}>{c.schedule}</span>
              </div>
              <div style={styles.cardRow}>
                <span style={styles.cardLabel}>Room</span>
                <span style={styles.cardValue}>{c.room}</span>
              </div>
            </div>
          ))}
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
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' },
  card: {
    backgroundColor: '#fff', borderRadius: '10px', padding: '20px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
  },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' },
  codeTag: {
    backgroundColor: '#eef2ff', color: '#4f46e5', fontSize: '12px',
    fontWeight: '600', padding: '3px 10px', borderRadius: '6px',
  },
  creditsTag: { fontSize: '12px', color: '#888' },
  cardTitle: { fontSize: '16px', color: '#1a1a2e', marginBottom: '14px' },
  cardRow: { display: 'flex', justifyContent: 'space-between', fontSize: '13px', padding: '6px 0', borderTop: '1px solid #f0f0f0' },
  cardLabel: { color: '#888' },
  cardValue: { color: '#333', fontWeight: '500' },
}
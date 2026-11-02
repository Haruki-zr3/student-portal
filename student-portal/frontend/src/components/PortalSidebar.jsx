import { useNavigate } from 'react-router-dom'

export default function PortalSidebar({ activePath, isAdmin = false }) {
  const navigate = useNavigate()

  function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/')
  }

  const academicItems = [
        { label: 'Dashboard', path: '/dashboard' },
        { label: 'Courses', path: '/courses' },
        { label: 'Grades', path: '/grades' },
        { label: 'Attendance', path: '/attendance' },
      ]

  const groups = isAdmin
    ? [{ label: 'Management', items: [{ label: 'Admin Panel', path: '/admin' }] }]
    : [{ label: 'Explore', items: academicItems }]

  return (
    <aside className="portal-sidebar">
      <div className="portal-sidebar-brand">
        <button type="button" onClick={() => navigate('/dashboard')} aria-label="Go to dashboard">
          <span className="portal-brand-mark">S</span>
          <span>Student Portal</span>
        </button>
      </div>

      <nav className="portal-sidebar-nav" aria-label="Main navigation">
        {groups.map((group) => (
          <div className="portal-nav-group" key={group.label}>
            <p className="portal-nav-label">{group.label}</p>
            {group.items.map((item) => (
              <button
                type="button"
                className={`portal-nav-item${activePath === item.path ? ' is-active' : ''}`}
                key={item.path}
                onClick={() => navigate(item.path)}
              >
                <span className="portal-nav-icon" aria-hidden="true">
                  {item.label === 'Dashboard' ? '⌂' : item.label === 'Courses' ? '▦' : item.label === 'Grades' ? '▤' : item.label === 'Attendance' ? '✓' : '⚙'}
                </span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        ))}
      </nav>

      <div className="portal-sidebar-footer">
        <button type="button" className="portal-logout" onClick={logout}>
          <span aria-hidden="true">↪</span>
          <span>Sign out</span>
        </button>
      </div>
    </aside>
  )
}

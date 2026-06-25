import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/login'
import Dashboard from './pages/dashboard'
import Courses from './pages/courses'
import Grades from './pages/grades'
import Attendance from './pages/attendance'
import AdminPanel from './pages/adminpanel'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/grades" element={<Grades />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login      from './pages/Login'
import Register   from './pages/Register'
import Dashboard  from './pages/Dashboard'
import Jobs       from './pages/Jobs'
import ResumePage from './pages/ResumePage'
import Matches    from './pages/Matches'

// Protect dashboard — redirect to login if not logged in
function PrivateRoute({ children }) {
  const token = localStorage.getItem('token')
  return token ? children : <Navigate to="/login" />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"          element={<Navigate to="/login" />} />
        <Route path="/login"     element={<Login />} />
        <Route path="/register"  element={<Register />} />
        <Route path="/dashboard" element={
          <PrivateRoute><Dashboard /></PrivateRoute>
        } />
        <Route path="/jobs" element={
          <PrivateRoute><Jobs /></PrivateRoute>
        } />
        <Route path="/resume" element={
          <PrivateRoute><ResumePage /></PrivateRoute>
        } />
        <Route path="/matches" element={
          <PrivateRoute><Matches /></PrivateRoute>
        } />
      </Routes>
    </BrowserRouter>
  )
}

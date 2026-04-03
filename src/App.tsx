import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import TopicSelector from './pages/TopicSelector';
import Session from './pages/Session';
import Summary from './pages/Summary';
import History from './pages/History';
import Profile from './pages/Profile';

import TeacherDashboard from './pages/TeacherDashboard';

export default function App() {
  const { user, userData, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const isTeacher = userData?.role === 'teacher' || userData?.role === 'admin';

  return (
    <Router>
      <Routes>
        <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/signup" element={user ? <Navigate to="/dashboard" /> : <Signup />} />
        
        <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/subjects/:subjectId" element={user ? <TopicSelector /> : <Navigate to="/login" />} />
        <Route path="/session/:sessionId" element={user ? <Session /> : <Navigate to="/login" />} />
        <Route path="/session/:sessionId/summary" element={user ? <Summary /> : <Navigate to="/login" />} />
        <Route path="/history" element={user ? <History /> : <Navigate to="/login" />} />
        <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
        <Route path="/teacher" element={user && isTeacher ? <TeacherDashboard /> : <Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
}

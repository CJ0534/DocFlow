import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Onboarding from './pages/Onboarding';
import AuthSuccess from './pages/AuthSuccess';
import OrgSetup from './pages/OrgSetup';
import ProjectSetup from './pages/ProjectSetup';
import DocumentUploadScreen from './pages/DocumentUploadScreen';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import OrganizationDetail from './pages/OrganizationDetail';
import ProjectDetail from './pages/ProjectDetail';
import './index.css';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'white' }}>
      Loading...
    </div>
  );

  if (!user) return <Navigate to="/login" />;
  return children;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
      <Route path="/auth-success" element={<ProtectedRoute><AuthSuccess /></ProtectedRoute>} />
      <Route path="/org-setup" element={<ProtectedRoute><OrgSetup /></ProtectedRoute>} />
      <Route path="/org/:orgId/new-project" element={<ProtectedRoute><ProjectSetup /></ProtectedRoute>} />
      <Route path="/project/:projectId/upload" element={<ProtectedRoute><DocumentUploadScreen /></ProtectedRoute>} />

      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/dashboard" element={
        <ProtectedRoute><Dashboard /></ProtectedRoute>
      } />

      <Route path="/settings" element={
        <ProtectedRoute><Settings /></ProtectedRoute>
      } />

      <Route path="/org/:orgId" element={
        <ProtectedRoute><OrganizationDetail /></ProtectedRoute>
      } />

      <Route path="/project/:projectId" element={
        <ProtectedRoute><ProjectDetail /></ProtectedRoute>
      } />

      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;


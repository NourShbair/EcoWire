import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import PolicyForm from './components/PolicyForm';
import PolicyDashboard from './components/PolicyDashboard';
import PoliciesList from './components/PoliciesList';
import LoginPage from './components/auth/LoginPage';
import SignupPage from './components/auth/SignupPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <div className="main-layout">
                <Sidebar />
                <main className="content-wrapper">
                  <Routes>
                    <Route path="/" element={<PolicyForm />} />
                    <Route path="/edit/:policyId" element={<PolicyForm />} />
                    <Route path="/policies" element={<PoliciesList />} />
                    <Route path="/dashboard/:policyId" element={<PolicyDashboard />} />
                  </Routes>
                </main>
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;

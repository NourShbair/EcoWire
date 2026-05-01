import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import PolicyForm from './components/PolicyForm';
import PolicyDashboard from './components/PolicyDashboard';
import PoliciesList from './components/PoliciesList';
import './App.css';

function App() {
  return (
    <Router>
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
    </Router>
  );
}

export default App;

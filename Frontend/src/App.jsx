import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import CreatePolicyForm from './components/CreatePolicyForm';
import Dashboard from './components/Dashboard';
import PoliciesList from './components/PoliciesList';
import './App.css';

function App() {
  return (
    <Router>
      <div className="main-layout">
        <Sidebar />
        <main className="content-wrapper">
          <Routes>
            <Route path="/" element={<CreatePolicyForm />} />
            <Route path="/policies" element={<PoliciesList />} />
            <Route path="/dashboard/:id" element={<Dashboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

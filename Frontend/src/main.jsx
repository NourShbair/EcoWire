import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom';
import './index.css'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <App />
    </Router>
  </StrictMode>,
)

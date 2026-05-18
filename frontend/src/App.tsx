import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Pages serão importadas conforme forem criadas
// import Dashboard from './pages/Dashboard';
// import Login from './pages/Login';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} /> */}
          <Route path="/" element={<div>VitaLink - Bem-vindo!</div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

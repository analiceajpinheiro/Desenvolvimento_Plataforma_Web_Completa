import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {
  Dashboard,
  PatientsList,
  PatientsForm,
  AppointmentsList,
  AppointmentsForm,
} from './pages';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Dashboard */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Pacientes */}
          <Route path="/patients" element={<PatientsList />} />
          <Route path="/patients/new" element={<PatientsForm />} />
          <Route path="/patients/:id/edit" element={<PatientsForm />} />

          {/* Agendamentos */}
          <Route path="/appointments" element={<AppointmentsList />} />
          <Route path="/appointments/new" element={<AppointmentsForm />} />

          {/* 404 */}
          <Route path="*" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

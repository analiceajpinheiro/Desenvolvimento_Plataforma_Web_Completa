import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Login } from './pages/Login';
import {
  Dashboard,
  PatientsList,
  PatientsForm,
  AppointmentsList,
  AppointmentsForm,
  MedicalRecordsList,
  MedicalRecordsForm,
  UsersList,
  UsersForm,
  ExamsList,
  ExamsForm,
  SpecialtiesList,
  SpecialtiesForm,
  HealthPlansList,
  HealthPlansForm,
} from './pages';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Pública */}
          <Route path="/login" element={<Login />} />

          {/* Raiz redireciona para dashboard (ProtectedRoute cuida do /login se não auth) */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Protegidas */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patients"
            element={
              <ProtectedRoute>
                <PatientsList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patients/new"
            element={
              <ProtectedRoute>
                <PatientsForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patients/:id/edit"
            element={
              <ProtectedRoute>
                <PatientsForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/appointments"
            element={
              <ProtectedRoute>
                <AppointmentsList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/appointments/new"
            element={
              <ProtectedRoute>
                <AppointmentsForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/medical-records"
            element={
              <ProtectedRoute>
                <MedicalRecordsList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/medical-records/new"
            element={
              <ProtectedRoute>
                <MedicalRecordsForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/medical-records/:id/edit"
            element={
              <ProtectedRoute>
                <MedicalRecordsForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users"
            element={
              <ProtectedRoute>
                <UsersList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users/new"
            element={
              <ProtectedRoute>
                <UsersForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users/:id/edit"
            element={
              <ProtectedRoute>
                <UsersForm />
              </ProtectedRoute>
            }
          />

          {/* Sprint 3: Exames */}
          <Route
            path="/exams"
            element={<ProtectedRoute><ExamsList /></ProtectedRoute>}
          />
          <Route
            path="/exams/new"
            element={<ProtectedRoute><ExamsForm /></ProtectedRoute>}
          />
          <Route
            path="/exams/:id/edit"
            element={<ProtectedRoute><ExamsForm /></ProtectedRoute>}
          />

          {/* Sprint 3: Especialidades */}
          <Route
            path="/specialties"
            element={<ProtectedRoute><SpecialtiesList /></ProtectedRoute>}
          />
          <Route
            path="/specialties/new"
            element={<ProtectedRoute><SpecialtiesForm /></ProtectedRoute>}
          />
          <Route
            path="/specialties/:id/edit"
            element={<ProtectedRoute><SpecialtiesForm /></ProtectedRoute>}
          />

          {/* Sprint 3: Convênios */}
          <Route
            path="/health-plans"
            element={<ProtectedRoute><HealthPlansList /></ProtectedRoute>}
          />
          <Route
            path="/health-plans/new"
            element={<ProtectedRoute><HealthPlansForm /></ProtectedRoute>}
          />
          <Route
            path="/health-plans/:id/edit"
            element={<ProtectedRoute><HealthPlansForm /></ProtectedRoute>}
          />

          {/* 404 */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;

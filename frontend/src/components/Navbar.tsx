import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/dashboard" className="flex items-center gap-2">
          <h1 className="text-2xl font-bold">VitaLink</h1>
        </Link>

        <div className="flex items-center gap-4 text-sm">
          <Link to="/dashboard" className="hover:text-blue-200 transition">
            Dashboard
          </Link>
          <Link to="/patients" className="hover:text-blue-200 transition">
            Pacientes
          </Link>
          <Link to="/appointments" className="hover:text-blue-200 transition">
            Agendamentos
          </Link>
          <Link to="/exams" className="hover:text-blue-200 transition">
            Exames
          </Link>
          <Link to="/specialties" className="hover:text-blue-200 transition">
            Especialidades
          </Link>
          <Link to="/health-plans" className="hover:text-blue-200 transition">
            Convênios
          </Link>

          <div className="border-l border-blue-400 pl-6 flex items-center gap-3">
            {user && (
              <span className="text-sm text-blue-100">
                {user.name}
              </span>
            )}
            <button
              onClick={logout}
              className="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded-lg transition"
            >
              Sair
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

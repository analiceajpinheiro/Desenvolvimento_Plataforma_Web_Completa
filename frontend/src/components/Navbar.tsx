import React from 'react';
import { Link } from 'react-router-dom';

export const Navbar: React.FC = () => {
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const user = localStorage.getItem('user');

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <h1 className="text-2xl font-bold">VitaLink</h1>
        </Link>

        <div className="flex items-center gap-6">
          <Link to="/patients" className="hover:text-blue-200 transition">
            Pacientes
          </Link>
          <Link to="/appointments" className="hover:text-blue-200 transition">
            Agendamentos
          </Link>
          <Link to="/dashboard" className="hover:text-blue-200 transition">
            Dashboard
          </Link>

          <div className="border-l border-blue-400 pl-6">
            {user && <span className="text-sm">{user}</span>}
            <button
              onClick={handleLogout}
              className="ml-4 bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded-lg transition"
            >
              Sair
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

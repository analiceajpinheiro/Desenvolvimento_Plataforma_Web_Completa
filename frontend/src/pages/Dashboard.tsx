import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Button } from '../components';

export const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Bem-vindo ao VitaLink!
          </h1>
          <p className="text-xl text-gray-600">
            Plataforma de Gestão em Saúde para Clínicas e Consultórios
          </p>
        </div>

        {/* Cards principais */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Pacientes */}
          <Link
            to="/patients"
            className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-lg shadow hover:shadow-lg transition transform hover:scale-105"
          >
            <div className="text-4xl mb-4">👥</div>
            <h2 className="text-2xl font-bold text-blue-800 mb-2">Pacientes</h2>
            <p className="text-blue-700 mb-4">
              Gerencie o cadastro e informações dos seus pacientes
            </p>
            <Button variant="primary" size="sm">
              Acessar →
            </Button>
          </Link>

          {/* Agendamentos */}
          <Link
            to="/appointments"
            className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-lg shadow hover:shadow-lg transition transform hover:scale-105"
          >
            <div className="text-4xl mb-4">📅</div>
            <h2 className="text-2xl font-bold text-green-800 mb-2">Agendamentos</h2>
            <p className="text-green-700 mb-4">
              Agende e gerencie as consultas dos seus pacientes
            </p>
            <Button variant="success" size="sm">
              Acessar →
            </Button>
          </Link>

          {/* Prontuários */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-lg shadow opacity-50">
            <div className="text-4xl mb-4">📋</div>
            <h2 className="text-2xl font-bold text-purple-800 mb-2">Prontuários</h2>
            <p className="text-purple-700 mb-4">
              Acesso a prontuários eletrônicos
            </p>
            <span className="text-purple-600 text-sm">Em desenvolvimento...</span>
          </div>
        </div>

        {/* Informações gerais */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Sobre */}
          <div className="bg-white p-8 rounded-lg shadow">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">📱 Sobre VitaLink</h3>
            <p className="text-gray-700 mb-4">
              VitaLink é uma plataforma web completa para gerenciamento de consultórios e
              clínicas de pequeno e médio porte, oferecendo funcionalidades de:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Cadastro e gerenciamento de pacientes</li>
              <li>Sistema de agendamentos inteligente</li>
              <li>Prontuários eletrônicos</li>
              <li>Geolocalização de farmácias e clínicas</li>
              <li>Prescrições digitais</li>
            </ul>
          </div>

          {/* Suporte */}
          <div className="bg-white p-8 rounded-lg shadow">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">❓ Precisa de Ajuda?</h3>
            <p className="text-gray-700 mb-4">
              Acesse nossa documentação completa ou entre em contato com o suporte.
            </p>
            <div className="space-y-3">
              <Button variant="secondary" className="w-full">
                Documentação
              </Button>
              <Button variant="secondary" className="w-full">
                Suporte Técnico
              </Button>
            </div>
          </div>
        </div>

        {/* Versão */}
        <div className="text-center mt-12 text-gray-500 text-sm">
          <p>VitaLink v1.0.0 - Plataforma de Gestão em Saúde</p>
        </div>
      </div>
    </div>
  );
};

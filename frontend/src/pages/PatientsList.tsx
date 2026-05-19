import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Alert,
  Button,
  Input,
  LoadingSpinner,
  Modal,
  Navbar,
} from '../components';
import { usePatients } from '../hooks/usePatients';
import { Patient } from '../types';
import { formatDate, formatPhone, formatCPF } from '../utils/validators';

export const PatientsList: React.FC = () => {
  const navigate = useNavigate();
  const {
    patients,
    loading,
    error,
    page,
    total,
    limit,
    fetchPatients,
    searchPatients,
    deletePatient,
  } = usePatients();

  const [searchQuery, setSearchQuery] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<Patient | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchPatients(page);
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      await searchPatients(searchQuery);
    } else {
      await fetchPatients(1);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    
    try {
      await deletePatient(deleteConfirm.id);
      setSuccessMessage('Paciente removido com sucesso');
      setDeleteConfirm(null);
    } catch {
      // Error is handled by hook
    }
  };

  const handlePageChange = (newPage: number) => {
    fetchPatients(newPage);
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Pacientes</h1>
          <Button
            variant="primary"
            onClick={() => navigate('/patients/new')}
          >
            + Novo Paciente
          </Button>
        </div>

        {/* Mensagens */}
        <div className="mb-6 space-y-3">
          {error && <Alert type="error" message={error} />}
          {successMessage && (
            <Alert
              type="success"
              message={successMessage}
              onClose={() => setSuccessMessage(null)}
            />
          )}
        </div>

        {/* Busca */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="flex gap-3">
            <Input
              placeholder="Buscar por nome ou CPF..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" variant="primary" className="w-32">
              Buscar
            </Button>
          </div>
        </form>

        {/* Loading */}
        {loading && (
          <div className="py-12">
            <LoadingSpinner message="Carregando pacientes..." />
          </div>
        )}

        {/* Tabela de pacientes */}
        {!loading && patients.length > 0 && (
          <>
            <div className="overflow-x-auto bg-white rounded-lg shadow">
              <table className="w-full">
                <thead className="bg-gray-100 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Nome
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      CPF
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Telefone
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Data Nascimento
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {patients.map((patient) => (
                    <tr
                      key={patient.id}
                      className="border-b border-gray-200 hover:bg-gray-50 transition"
                    >
                      <td className="px-6 py-4 text-sm text-gray-800">
                        {patient.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {formatCPF(patient.cpf)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {patient.email}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {formatPhone(patient.phone)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {formatDate(patient.birthDate)}
                      </td>
                      <td className="px-6 py-4 text-center space-x-2">
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() =>
                            navigate(`/patients/${patient.id}/edit`)
                          }
                        >
                          Editar
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => setDeleteConfirm(patient)}
                        >
                          Deletar
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Paginação */}
            <div className="mt-6 flex justify-between items-center">
              <p className="text-sm text-gray-600">
                Mostrando {(page - 1) * limit + 1} a{' '}
                {Math.min(page * limit, total)} de {total} pacientes
              </p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  disabled={page === 1}
                  onClick={() => handlePageChange(page - 1)}
                >
                  ← Anterior
                </Button>
                <span className="px-3 py-2 text-gray-700">
                  Página {page} de {totalPages}
                </span>
                <Button
                  size="sm"
                  variant="secondary"
                  disabled={page === totalPages}
                  onClick={() => handlePageChange(page + 1)}
                >
                  Próxima →
                </Button>
              </div>
            </div>
          </>
        )}

        {/* Sem resultados */}
        {!loading && patients.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-gray-500 text-lg">Nenhum paciente encontrado</p>
            <Button
              variant="primary"
              onClick={() => navigate('/patients/new')}
              className="mt-4"
            >
              Criar Primeiro Paciente
            </Button>
          </div>
        )}
      </div>

      {/* Modal de confirmação de exclusão */}
      <Modal
        isOpen={!!deleteConfirm}
        title="Confirmar Exclusão"
        onClose={() => setDeleteConfirm(null)}
        onConfirm={handleDelete}
        confirmVariant="danger"
        confirmText="Deletar"
      >
        <p className="text-gray-700">
          Tem certeza que deseja deletar o paciente{' '}
          <strong>{deleteConfirm?.name}</strong>? Esta ação não pode ser
          desfeita.
        </p>
      </Modal>
    </div>
  );
};

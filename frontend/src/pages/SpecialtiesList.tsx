import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, Button, LoadingSpinner, Modal, Navbar } from '../components';
import { useSpecialties } from '../hooks/useSpecialties';
import { Specialty } from '../types';

export const SpecialtiesList: React.FC = () => {
  const navigate = useNavigate();
  const { specialties, loading, error, total, fetchSpecialties, deleteSpecialty } = useSpecialties();

  const [deleteConfirm, setDeleteConfirm] = useState<Specialty | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchSpecialties();
  }, []);

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await deleteSpecialty(deleteConfirm.id);
      setSuccessMessage('Especialidade desativada com sucesso');
      setDeleteConfirm(null);
    } catch {
      // Error is handled by hook
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Especialidades</h1>
          <Button variant="primary" onClick={() => navigate('/specialties/new')}>
            + Nova Especialidade
          </Button>
        </div>

        <div className="mb-6 space-y-3">
          {error && <Alert type="error" message={error} />}
          {successMessage && (
            <Alert type="success" message={successMessage} onClose={() => setSuccessMessage(null)} />
          )}
        </div>

        {loading && (
          <div className="py-12">
            <LoadingSpinner message="Carregando especialidades..." />
          </div>
        )}

        {!loading && specialties.length > 0 && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-100 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Nome</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Descrição</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Ações</th>
                </tr>
              </thead>
              <tbody>
                {specialties.map((specialty) => (
                  <tr key={specialty.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm font-medium text-gray-800">{specialty.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{specialty.description ?? '-'}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          specialty.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {specialty.isActive ? 'Ativa' : 'Inativa'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center space-x-2">
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => navigate(`/specialties/${specialty.id}/edit`)}
                      >
                        Editar
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => setDeleteConfirm(specialty)}
                      >
                        Desativar
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="px-6 py-3 text-sm text-gray-500 bg-gray-50">
              Total: {total} especialidade(s)
            </div>
          </div>
        )}

        {!loading && specialties.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-gray-500 text-lg">Nenhuma especialidade cadastrada</p>
            <Button variant="primary" onClick={() => navigate('/specialties/new')} className="mt-4">
              Cadastrar Primeira Especialidade
            </Button>
          </div>
        )}
      </div>

      <Modal
        isOpen={!!deleteConfirm}
        title="Confirmar Desativação"
        onClose={() => setDeleteConfirm(null)}
        onConfirm={handleDelete}
        confirmVariant="danger"
        confirmText="Desativar"
      >
        <p className="text-gray-700">
          Tem certeza que deseja desativar a especialidade <strong>{deleteConfirm?.name}</strong>?
        </p>
      </Modal>
    </div>
  );
};

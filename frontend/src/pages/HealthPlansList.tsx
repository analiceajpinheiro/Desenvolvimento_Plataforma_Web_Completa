import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, Button, LoadingSpinner, Modal, Navbar } from '../components';
import { useHealthPlans } from '../hooks/useHealthPlans';
import { HealthPlan } from '../types';

const formatDate = (dateStr: string) => {
  try {
    return new Date(dateStr).toLocaleDateString('pt-BR');
  } catch {
    return dateStr;
  }
};

export const HealthPlansList: React.FC = () => {
  const navigate = useNavigate();
  const { healthPlans, loading, error, page, total, limit, fetchHealthPlans, deleteHealthPlan } = useHealthPlans();

  const [deleteConfirm, setDeleteConfirm] = useState<HealthPlan | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchHealthPlans(1);
  }, []);

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await deleteHealthPlan(deleteConfirm.id);
      setSuccessMessage('Convênio removido com sucesso');
      setDeleteConfirm(null);
    } catch {
      // Error is handled by hook
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Convênios</h1>
          <Button variant="primary" onClick={() => navigate('/health-plans/new')}>
            + Novo Convênio
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
            <LoadingSpinner message="Carregando convênios..." />
          </div>
        )}

        {!loading && healthPlans.length > 0 && (
          <>
            <div className="overflow-x-auto bg-white rounded-lg shadow">
              <table className="w-full">
                <thead className="bg-gray-100 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Plano</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Operadora</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Nº do Plano</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Paciente</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Válido até</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                    <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {healthPlans.map((plan) => (
                    <tr key={plan.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                      <td className="px-6 py-4 text-sm font-medium text-gray-800">{plan.planName}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{plan.provider}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{plan.planNumber}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{plan.patient?.name ?? plan.patientId}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{formatDate(plan.validUntil)}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            plan.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {plan.isActive ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center space-x-2">
                        <Button size="sm" variant="primary" onClick={() => navigate(`/health-plans/${plan.id}/edit`)}>
                          Editar
                        </Button>
                        <Button size="sm" variant="danger" onClick={() => setDeleteConfirm(plan)}>
                          Deletar
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex justify-between items-center">
              <p className="text-sm text-gray-600">
                Mostrando {(page - 1) * limit + 1} a {Math.min(page * limit, total)} de {total} convênios
              </p>
              <div className="flex gap-2">
                <Button size="sm" variant="secondary" disabled={page === 1} onClick={() => fetchHealthPlans(page - 1)}>
                  ← Anterior
                </Button>
                <span className="px-3 py-2 text-gray-700">Página {page} de {totalPages}</span>
                <Button size="sm" variant="secondary" disabled={page === totalPages} onClick={() => fetchHealthPlans(page + 1)}>
                  Próxima →
                </Button>
              </div>
            </div>
          </>
        )}

        {!loading && healthPlans.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-gray-500 text-lg">Nenhum convênio encontrado</p>
            <Button variant="primary" onClick={() => navigate('/health-plans/new')} className="mt-4">
              Cadastrar Primeiro Convênio
            </Button>
          </div>
        )}
      </div>

      <Modal
        isOpen={!!deleteConfirm}
        title="Confirmar Exclusão"
        onClose={() => setDeleteConfirm(null)}
        onConfirm={handleDelete}
        confirmVariant="danger"
        confirmText="Deletar"
      >
        <p className="text-gray-700">
          Tem certeza que deseja deletar o convênio <strong>{deleteConfirm?.planName}</strong>?
        </p>
      </Modal>
    </div>
  );
};

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, Button, LoadingSpinner, Modal, Navbar } from '../components';
import { useExams } from '../hooks/useExams';
import { Exam, ExamStatus, ExamType } from '../types';

const examTypeLabel: Record<ExamType, string> = {
  LAB: 'Laboratorial',
  IMAGE: 'Imagem',
  FUNCTIONAL: 'Funcional',
  OTHER: 'Outro',
};

const examStatusLabel: Record<ExamStatus, string> = {
  REQUESTED: 'Solicitado',
  SCHEDULED: 'Agendado',
  IN_PROGRESS: 'Em Andamento',
  COMPLETED: 'Concluído',
  CANCELLED: 'Cancelado',
};

const examStatusColor: Record<ExamStatus, string> = {
  REQUESTED: 'bg-yellow-100 text-yellow-800',
  SCHEDULED: 'bg-blue-100 text-blue-800',
  IN_PROGRESS: 'bg-purple-100 text-purple-800',
  COMPLETED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
};

export const ExamsList: React.FC = () => {
  const navigate = useNavigate();
  const { exams, loading, error, page, total, limit, fetchExams, deleteExam } = useExams();

  const [deleteConfirm, setDeleteConfirm] = useState<Exam | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchExams(1);
  }, []);

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await deleteExam(deleteConfirm.id);
      setSuccessMessage('Exame removido com sucesso');
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
          <h1 className="text-3xl font-bold text-gray-800">Exames</h1>
          <Button variant="primary" onClick={() => navigate('/exams/new')}>
            + Novo Exame
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
            <LoadingSpinner message="Carregando exames..." />
          </div>
        )}

        {!loading && exams.length > 0 && (
          <>
            <div className="overflow-x-auto bg-white rounded-lg shadow">
              <table className="w-full">
                <thead className="bg-gray-100 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Exame</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Tipo</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Paciente</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Médico</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                    <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {exams.map((exam) => (
                    <tr key={exam.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                      <td className="px-6 py-4 text-sm font-medium text-gray-800">{exam.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{examTypeLabel[exam.type]}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{exam.patient?.name ?? exam.patientId}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{exam.doctor?.name ?? exam.doctorId}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${examStatusColor[exam.status]}`}>
                          {examStatusLabel[exam.status]}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center space-x-2">
                        <Button size="sm" variant="primary" onClick={() => navigate(`/exams/${exam.id}/edit`)}>
                          Editar
                        </Button>
                        <Button size="sm" variant="danger" onClick={() => setDeleteConfirm(exam)}>
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
                Mostrando {(page - 1) * limit + 1} a {Math.min(page * limit, total)} de {total} exames
              </p>
              <div className="flex gap-2">
                <Button size="sm" variant="secondary" disabled={page === 1} onClick={() => fetchExams(page - 1)}>
                  ← Anterior
                </Button>
                <span className="px-3 py-2 text-gray-700">Página {page} de {totalPages}</span>
                <Button size="sm" variant="secondary" disabled={page === totalPages} onClick={() => fetchExams(page + 1)}>
                  Próxima →
                </Button>
              </div>
            </div>
          </>
        )}

        {!loading && exams.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-gray-500 text-lg">Nenhum exame encontrado</p>
            <Button variant="primary" onClick={() => navigate('/exams/new')} className="mt-4">
              Solicitar Primeiro Exame
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
          Tem certeza que deseja deletar o exame <strong>{deleteConfirm?.name}</strong>?
        </p>
      </Modal>
    </div>
  );
};

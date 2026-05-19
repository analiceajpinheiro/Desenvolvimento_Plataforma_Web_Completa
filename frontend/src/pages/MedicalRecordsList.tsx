import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Alert,
  Button,
  Input,
  LoadingSpinner,
  Modal,
  Navbar,
} from '../components';
import { useMedicalRecords } from '../hooks/useMedicalRecords';
import { MedicalRecord } from '../services/medicalRecordService';
import { formatDate } from '../utils/validators';

export const MedicalRecordsList: React.FC = () => {
  const navigate = useNavigate();
  const { records, loading, error, fetchRecords, removeRecord } =
    useMedicalRecords();

  const [searchQuery, setSearchQuery] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<MedicalRecord | null>(
    null
  );
  const [viewRecord, setViewRecord] = useState<MedicalRecord | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const limit = 10;

  useEffect(() => {
    fetchRecords();
  }, []);

  const filteredRecords = useMemo(() => {
    if (!searchQuery.trim()) return records;
    const q = searchQuery.toLowerCase();
    return records.filter(
      (r) =>
        r.patient?.name?.toLowerCase().includes(q) ||
        r.doctor?.name?.toLowerCase().includes(q)
    );
  }, [records, searchQuery]);

  const total = filteredRecords.length;
  const totalPages = Math.ceil(total / limit) || 1;
  const pagedRecords = filteredRecords.slice((page - 1) * limit, page * limit);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setPage(1);
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await removeRecord(deleteConfirm.id);
      setSuccessMessage('Prontuário removido com sucesso');
      setDeleteConfirm(null);
    } catch {
      // Error is handled by hook
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Prontuários</h1>
          <Button
            variant="primary"
            onClick={() => navigate('/medical-records/new')}
          >
            + Novo Prontuário
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
        <form className="mb-6">
          <Input
            placeholder="Buscar por paciente ou médico..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="max-w-sm"
          />
        </form>

        {/* Loading */}
        {loading && (
          <div className="py-12">
            <LoadingSpinner message="Carregando prontuários..." />
          </div>
        )}

        {/* Tabela */}
        {!loading && pagedRecords.length > 0 && (
          <>
            <div className="overflow-x-auto bg-white rounded-lg shadow">
              <table className="w-full">
                <thead className="bg-gray-100 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Paciente
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Médico
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Data
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Queixa Principal
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Diagnóstico
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {pagedRecords.map((record) => (
                    <tr
                      key={record.id}
                      className="border-b border-gray-200 hover:bg-gray-50 transition"
                    >
                      <td className="px-6 py-4 text-sm text-gray-800">
                        {record.patient?.name || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {record.doctor?.name
                          ? `Dr(a). ${record.doctor.name}`
                          : 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {formatDate(record.createdAt)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-xs">
                        <span className="block truncate">
                          {record.mainComplaint}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-xs">
                        {record.diagnosis ? (
                          <span className="block truncate">
                            {record.diagnosis}
                          </span>
                        ) : (
                          <span className="text-gray-400 italic">
                            Não informado
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center space-x-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => setViewRecord(record)}
                        >
                          Visualizar
                        </Button>
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() =>
                            navigate(`/medical-records/${record.id}/edit`)
                          }
                        >
                          Editar
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => setDeleteConfirm(record)}
                        >
                          Excluir
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
                {Math.min(page * limit, total)} de {total} prontuários
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
        {!loading && filteredRecords.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-gray-500 text-lg">Nenhum prontuário encontrado</p>
            <Button
              variant="primary"
              onClick={() => navigate('/medical-records/new')}
              className="mt-4"
            >
              Criar Primeiro Prontuário
            </Button>
          </div>
        )}
      </div>

      {/* Modal de visualização detalhada */}
      {viewRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
              <h2 className="text-xl font-bold text-gray-800">
                Prontuário — {viewRecord.patient?.name || 'Paciente'}
              </h2>
              <button
                onClick={() => setViewRecord(null)}
                className="text-gray-400 hover:text-gray-600 text-3xl font-light leading-none"
              >
                ×
              </button>
            </div>

            <div className="px-6 py-4 space-y-4">
              {/* Cabeçalho do prontuário */}
              <div className="grid grid-cols-2 gap-4 pb-4 border-b border-gray-100">
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold tracking-wide mb-1">
                    Paciente
                  </p>
                  <p className="text-gray-800 font-medium">
                    {viewRecord.patient?.name || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold tracking-wide mb-1">
                    Médico
                  </p>
                  <p className="text-gray-800 font-medium">
                    {viewRecord.doctor
                      ? `Dr(a). ${viewRecord.doctor.name}`
                      : 'N/A'}
                  </p>
                  {viewRecord.doctor?.specialty && (
                    <p className="text-gray-500 text-sm">
                      {viewRecord.doctor.specialty}
                    </p>
                  )}
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold tracking-wide mb-1">
                    Data de Criação
                  </p>
                  <p className="text-gray-800">{formatDate(viewRecord.createdAt)}</p>
                </div>
              </div>

              {/* Campos clínicos */}
              {[
                { label: 'Queixa Principal', value: viewRecord.mainComplaint },
                { label: 'Histórico', value: viewRecord.history },
                { label: 'Exame Físico', value: viewRecord.physicalExam },
                { label: 'Diagnóstico', value: viewRecord.diagnosis },
                { label: 'Tratamento', value: viewRecord.treatment },
              ].map(
                ({ label, value }) =>
                  value && (
                    <div key={label}>
                      <p className="text-xs text-gray-500 uppercase font-semibold tracking-wide mb-1">
                        {label}
                      </p>
                      <p className="text-gray-800 bg-gray-50 rounded-lg p-3 text-sm whitespace-pre-wrap">
                        {value}
                      </p>
                    </div>
                  )
              )}

              {/* Prescrições */}
              {viewRecord.prescriptions && viewRecord.prescriptions.length > 0 && (
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold tracking-wide mb-2">
                    Prescrições ({viewRecord.prescriptions.length})
                  </p>
                  <div className="space-y-2">
                    {viewRecord.prescriptions.map((p) => (
                      <div
                        key={p.id}
                        className="bg-gray-50 rounded-lg p-3 text-sm"
                      >
                        <span className="font-medium">{p.medication}</span>
                        <span className="text-gray-600">
                          {' '}
                          — {p.dosage}, {p.frequency}, por {p.duration}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
              <Button
                variant="primary"
                onClick={() => {
                  setViewRecord(null);
                  navigate(`/medical-records/${viewRecord.id}/edit`);
                }}
              >
                Editar
              </Button>
              <Button variant="secondary" onClick={() => setViewRecord(null)}>
                Fechar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmação de exclusão */}
      <Modal
        isOpen={!!deleteConfirm}
        title="Confirmar Exclusão"
        onClose={() => setDeleteConfirm(null)}
        onConfirm={handleDelete}
        confirmVariant="danger"
        confirmText="Excluir"
      >
        <p className="text-gray-700">
          Tem certeza que deseja excluir o prontuário de{' '}
          <strong>{deleteConfirm?.patient?.name}</strong>? Esta ação não pode
          ser desfeita.
        </p>
      </Modal>
    </div>
  );
};

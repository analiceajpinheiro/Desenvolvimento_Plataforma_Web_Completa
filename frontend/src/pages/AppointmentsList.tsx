import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Alert,
  Button,
  Input,
  LoadingSpinner,
  Modal,
  Navbar,
  Select,
} from '../components';
import { useAppointments } from '../hooks/useAppointments';
import { usePatients } from '../hooks/usePatients';
import { Appointment, AppointmentStatus, User } from '../types';
import { formatDateTime, formatDate } from '../utils/validators';
import api from '../services/api';

export const AppointmentsList: React.FC = () => {
  const navigate = useNavigate();
  const {
    appointments,
    loading,
    error,
    page,
    total,
    limit,
    fetchAppointments,
    cancelAppointment,
  } = useAppointments();

  const [cancelConfirm, setCancelConfirm] = useState<Appointment | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('');

  useEffect(() => {
    fetchAppointments(page);
  }, [page]);

  const handleCancel = async () => {
    if (!cancelConfirm) return;

    try {
      await cancelAppointment(cancelConfirm.id, cancelReason);
      setSuccessMessage('Agendamento cancelado com sucesso');
      setCancelConfirm(null);
      setCancelReason('');
    } catch {
      // Error is handled by hook
    }
  };

  const handlePageChange = (newPage: number) => {
    fetchAppointments(newPage);
  };

  const totalPages = Math.ceil(total / limit);

  const getStatusBadgeColor = (status: AppointmentStatus) => {
    const colors = {
      [AppointmentStatus.CONFIRMED]: 'bg-green-100 text-green-800',
      [AppointmentStatus.CANCELLED]: 'bg-red-100 text-red-800',
      [AppointmentStatus.COMPLETED]: 'bg-blue-100 text-blue-800',
      [AppointmentStatus.RESCHEDULED]: 'bg-yellow-100 text-yellow-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Agendamentos</h1>
          <Button
            variant="primary"
            onClick={() => navigate('/appointments/new')}
          >
            + Novo Agendamento
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

        {/* Filtros */}
        <div className="mb-6 flex gap-3">
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: '', label: 'Todos os Status' },
              { value: 'CONFIRMED', label: 'Confirmado' },
              { value: 'CANCELLED', label: 'Cancelado' },
              { value: 'COMPLETED', label: 'Completado' },
            ]}
            className="w-64"
          />
        </div>

        {/* Loading */}
        {loading && (
          <div className="py-12">
            <LoadingSpinner message="Carregando agendamentos..." />
          </div>
        )}

        {/* Tabela de agendamentos */}
        {!loading && appointments.length > 0 && (
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
                      Data/Hora
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Status
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((appointment) => (
                    <tr
                      key={appointment.id}
                      className="border-b border-gray-200 hover:bg-gray-50 transition"
                    >
                      <td className="px-6 py-4 text-sm text-gray-800">
                        {appointment.patient?.name || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {appointment.doctor?.name || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {formatDateTime(appointment.date)}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(
                            appointment.status
                          )}`}
                        >
                          {appointment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center space-x-2">
                        {appointment.status === AppointmentStatus.CONFIRMED && (
                          <>
                            <Button
                              size="sm"
                              variant="primary"
                              onClick={() =>
                                navigate(`/appointments/${appointment.id}`)
                              }
                            >
                              Detalhes
                            </Button>
                            <Button
                              size="sm"
                              variant="danger"
                              onClick={() => setCancelConfirm(appointment)}
                            >
                              Cancelar
                            </Button>
                          </>
                        )}
                        {appointment.status !== AppointmentStatus.CONFIRMED && (
                          <Button
                            size="sm"
                            variant="secondary"
                            disabled
                          >
                            {appointment.status}
                          </Button>
                        )}
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
                {Math.min(page * limit, total)} de {total} agendamentos
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
        {!loading && appointments.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-gray-500 text-lg">Nenhum agendamento encontrado</p>
            <Button
              variant="primary"
              onClick={() => navigate('/appointments/new')}
              className="mt-4"
            >
              Criar Primeiro Agendamento
            </Button>
          </div>
        )}
      </div>

      {/* Modal de cancelamento */}
      <Modal
        isOpen={!!cancelConfirm}
        title="Cancelar Agendamento"
        onClose={() => {
          setCancelConfirm(null);
          setCancelReason('');
        }}
        onConfirm={handleCancel}
        confirmVariant="danger"
        confirmText="Cancelar Agendamento"
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            Tem certeza que deseja cancelar o agendamento de{' '}
            <strong>{cancelConfirm?.patient?.name}</strong> em{' '}
            <strong>{formatDateTime(cancelConfirm?.date || '')}</strong>?
          </p>
          <Input
            label="Motivo do Cancelamento"
            placeholder="Ex: Paciente solicitou reagendamento"
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
          />
        </div>
      </Modal>
    </div>
  );
};

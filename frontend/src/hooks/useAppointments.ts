import { useState, useCallback } from 'react';
import { Appointment, AppointmentStatus } from '../types';
import { appointmentService } from '../services/appointmentService';
import { mockAppointments } from '../mocks/mockData';

export const useAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [isUsingMockData, setIsUsingMockData] = useState(false);

  const fetchAppointments = useCallback(async (pageNum = 1) => {
    setLoading(true);
    setError(null);
    try {
      const response = await appointmentService.listAppointments(pageNum, limit);
      setAppointments(response.data);
      setPage(pageNum);
      setTotal(response.total);
      setIsUsingMockData(false);
    } catch (err) {
      // Fallback para dados mockados
      const paginatedMock = mockAppointments.slice(
        (pageNum - 1) * limit,
        pageNum * limit
      );
      setAppointments(paginatedMock);
      setPage(pageNum);
      setTotal(mockAppointments.length);
      setIsUsingMockData(true);
      setError('Usando dados de exemplo (API indisponível)');
    } finally {
      setLoading(false);
    }
  }, [limit]);

  const fetchPatientAppointments = useCallback(async (patientId: string) => {
    setLoading(true);
    setError(null);
    try {
      const results = await appointmentService.getPatientAppointments(patientId);
      setAppointments(results);
      setIsUsingMockData(false);
    } catch (err) {
      // Fallback: filtrar de mock data
      const filtered = mockAppointments.filter(
        (a) => a.patientId === patientId
      );
      setAppointments(filtered);
      setIsUsingMockData(true);
      setError('Usando dados de exemplo (API indisponível)');
    } finally {
      setLoading(false);
    }
  }, []);

  const addAppointment = useCallback(
    async (appointmentData: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => {
      setLoading(true);
      setError(null);
      try {
        const newAppointment = await appointmentService.createAppointment(appointmentData);
        setAppointments((prev) => [newAppointment, ...prev]);
        setIsUsingMockData(false);
        return newAppointment;
      } catch (err) {
        // Fallback: criar localmente
        const newAppointment: Appointment = {
          id: Date.now().toString(),
          ...appointmentData,
          status: AppointmentStatus.CONFIRMED,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setAppointments((prev) => [newAppointment, ...prev]);
        setIsUsingMockData(true);
        setError('Agendamento criado localmente (API indisponível)');
        return newAppointment;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const updateAppointment = useCallback(
    async (
      id: string,
      appointmentData: Partial<Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>>
    ) => {
      setLoading(true);
      setError(null);
      try {
        const updated = await appointmentService.updateAppointment(id, appointmentData);
        setAppointments((prev) =>
          prev.map((a) => (a.id === id ? updated : a))
        );
        setIsUsingMockData(false);
        return updated;
      } catch (err) {
        // Fallback: atualizar localmente
        const existingAppointment = appointments.find((a) => a.id === id);
        if (existingAppointment) {
          const updated: Appointment = {
            ...existingAppointment,
            ...appointmentData,
            updatedAt: new Date().toISOString(),
          };
          setAppointments((prev) =>
            prev.map((a) => (a.id === id ? updated : a))
          );
          setIsUsingMockData(true);
          setError('Agendamento atualizado localmente (API indisponível)');
          return updated;
        }
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [appointments]
  );

  const cancelAppointment = useCallback(
    async (id: string, reason: string) => {
      setLoading(true);
      setError(null);
      try {
        const updated = await appointmentService.cancelAppointment(id, reason);
        setAppointments((prev) =>
          prev.map((a) => (a.id === id ? updated : a))
        );
        setIsUsingMockData(false);
        return updated;
      } catch (err) {
        // Fallback: cancelar localmente
        const existingAppointment = appointments.find((a) => a.id === id);
        if (existingAppointment) {
          const updated: Appointment = {
            ...existingAppointment,
            status: AppointmentStatus.CANCELLED,
            updatedAt: new Date().toISOString(),
          };
          setAppointments((prev) =>
            prev.map((a) => (a.id === id ? updated : a))
          );
          setIsUsingMockData(true);
          setError('Agendamento cancelado localmente (API indisponível)');
          return updated;
        }
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [appointments]
  );

  return {
    appointments,
    loading,
    error,
    page,
    limit,
    total,
    fetchAppointments,
    fetchPatientAppointments,
    addAppointment,
    updateAppointment,
    cancelAppointment,
    setLimit,
  };
};

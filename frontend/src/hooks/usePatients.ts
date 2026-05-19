import { useState, useCallback } from 'react';
import { Patient } from '../types';
import { patientService } from '../services/patientService';
import { mockPatients } from '../mocks/mockData';

export const usePatients = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [isUsingMockData, setIsUsingMockData] = useState(false);

  const fetchPatients = useCallback(async (pageNum = 1) => {
    setLoading(true);
    setError(null);
    try {
      const response = await patientService.listPatients(pageNum, limit);
      setPatients(response.data);
      setPage(pageNum);
      setTotal(response.total);
      setIsUsingMockData(false);
    } catch (err) {
      // Fallback para dados mockados quando API não está disponível
      const paginatedMock = mockPatients.slice(
        (pageNum - 1) * limit,
        pageNum * limit
      );
      setPatients(paginatedMock);
      setPage(pageNum);
      setTotal(mockPatients.length);
      setIsUsingMockData(true);
      setError('Usando dados de exemplo (API indisponível)');
    } finally {
      setLoading(false);
    }
  }, [limit]);

  const searchPatients = useCallback(async (query: string) => {
    setLoading(true);
    setError(null);
    try {
      const results = await patientService.searchPatients(query);
      setPatients(results);
      setIsUsingMockData(false);
    } catch (err) {
      // Fallback para busca em mock data
      const filtered = mockPatients.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.cpf.includes(query)
      );
      setPatients(filtered);
      setIsUsingMockData(true);
      setError('Usando dados de exemplo (API indisponível)');
    } finally {
      setLoading(false);
    }
  }, []);

  const addPatient = useCallback(
    async (patientData: Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>) => {
      setLoading(true);
      setError(null);
      try {
        const newPatient = await patientService.createPatient(patientData);
        setPatients((prev) => [newPatient, ...prev]);
        setIsUsingMockData(false);
        return newPatient;
      } catch (err) {
        // Fallback: criar paciente em mock data
        const newPatient: Patient = {
          id: Date.now().toString(),
          ...patientData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setPatients((prev) => [newPatient, ...prev]);
        setIsUsingMockData(true);
        setError('Paciente criado localmente (API indisponível)');
        return newPatient;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const updatePatient = useCallback(
    async (
      id: string,
      patientData: Partial<Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>>
    ) => {
      setLoading(true);
      setError(null);
      try {
        const updatedPatient = await patientService.updatePatient(
          id,
          patientData
        );
        setPatients((prev) =>
          prev.map((p) => (p.id === id ? updatedPatient : p))
        );
        setIsUsingMockData(false);
        return updatedPatient;
      } catch (err) {
        // Fallback: atualizar em mock data
        const existingPatient = patients.find((p) => p.id === id);
        if (existingPatient) {
          const updatedPatient: Patient = {
            ...existingPatient,
            ...patientData,
            updatedAt: new Date().toISOString(),
          };
          setPatients((prev) =>
            prev.map((p) => (p.id === id ? updatedPatient : p))
          );
          setIsUsingMockData(true);
          setError('Paciente atualizado localmente (API indisponível)');
          return updatedPatient;
        }
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [patients]
  );

  const deletePatient = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await patientService.deletePatient(id);
      setPatients((prev) => prev.filter((p) => p.id !== id));
      setIsUsingMockData(false);
    } catch (err) {
      // Fallback: deletar de mock data
      setPatients((prev) => prev.filter((p) => p.id !== id));
      setIsUsingMockData(true);
      setError('Paciente removido localmente (API indisponível)');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    patients,
    loading,
    error,
    page,
    limit,
    total,
    fetchPatients,
    searchPatients,
    addPatient,
    updatePatient,
    deletePatient,
    setLimit,
  };
};

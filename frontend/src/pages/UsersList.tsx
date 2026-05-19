import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import {
  Alert,
  Button,
  LoadingSpinner,
  Modal,
  Navbar,
  Select,
} from '../components';
import { useAuth } from '../contexts/AuthContext';
import { userService } from '../services/userService';
import { User, UserRole } from '../types';

const ROLE_LABELS: Record<string, string> = {
  DOCTOR: 'Médico',
  RECEPTIONIST: 'Recepcionista',
  ADMIN: 'Administrador',
};

export const UsersList: React.FC = () => {
  const navigate = useNavigate();
  const { user: currentUser, isLoading: authLoading } = useAuth();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [roleFilter, setRoleFilter] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [toggleConfirm, setToggleConfirm] = useState<User | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const limit = 10;

  const fetchUsers = useCallback(async (pageNum: number, role: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await userService.getAll(pageNum, role || undefined);
      setUsers(result.data || []);
      setTotal(result.pagination?.total || 0);
      setTotalPages(result.pagination?.totalPages || 1);
    } catch {
      setError('Erro ao carregar membros da equipe');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authLoading && currentUser?.role === UserRole.ADMIN) {
      fetchUsers(page, roleFilter);
    }
  }, [page, roleFilter, authLoading, currentUser, fetchUsers]);

  const handleRoleFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setRoleFilter(e.target.value);
    setPage(1);
  };

  const handleToggleActive = async () => {
    if (!toggleConfirm) return;
    try {
      const updated = await userService.update(toggleConfirm.id, {
        isActive: !toggleConfirm.isActive,
      });
      setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
      setSuccessMessage(
        updated.isActive
          ? `${updated.name} foi ativado com sucesso`
          : `${updated.name} foi desativado com sucesso`
      );
      setToggleConfirm(null);
    } catch {
      setError('Erro ao atualizar status do membro');
      setToggleConfirm(null);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" message="Verificando permissões..." />
      </div>
    );
  }

  if (currentUser?.role !== UserRole.ADMIN) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Equipe</h1>
          <Button
            variant="primary"
            onClick={() => navigate('/users/new')}
          >
            + Novo Membro
          </Button>
        </div>

        {/* Mensagens */}
        <div className="mb-6 space-y-3">
          {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
          {successMessage && (
            <Alert
              type="success"
              message={successMessage}
              onClose={() => setSuccessMessage(null)}
            />
          )}
        </div>

        {/* Filtro por função */}
        <div className="mb-6 max-w-xs">
          <Select
            label=""
            name="roleFilter"
            value={roleFilter}
            onChange={handleRoleFilterChange}
            options={[
              { value: '', label: 'Todos' },
              { value: 'DOCTOR', label: 'Médicos' },
              { value: 'RECEPTIONIST', label: 'Recepcionistas' },
            ]}
          />
        </div>

        {/* Loading */}
        {loading && (
          <div className="py-12">
            <LoadingSpinner message="Carregando equipe..." />
          </div>
        )}

        {/* Tabela */}
        {!loading && users.length > 0 && (
          <>
            <div className="overflow-x-auto bg-white rounded-lg shadow">
              <table className="w-full">
                <thead className="bg-gray-100 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Nome
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Função
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Especialidade
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
                  {users.map((member) => (
                    <tr
                      key={member.id}
                      className="border-b border-gray-200 hover:bg-gray-50 transition"
                    >
                      <td className="px-6 py-4 text-sm text-gray-800 font-medium">
                        {member.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {member.email}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {ROLE_LABELS[member.role] ?? member.role}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {member.specialty ?? (
                          <span className="text-gray-400 italic">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            member.isActive
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {member.isActive ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center space-x-2">
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => navigate(`/users/${member.id}/edit`)}
                        >
                          Editar
                        </Button>
                        <Button
                          size="sm"
                          variant={member.isActive ? 'danger' : 'success'}
                          onClick={() => setToggleConfirm(member)}
                        >
                          {member.isActive ? 'Desativar' : 'Ativar'}
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
                {Math.min(page * limit, total)} de {total} membros
              </p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
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
                  onClick={() => setPage((p) => p + 1)}
                >
                  Próxima →
                </Button>
              </div>
            </div>
          </>
        )}

        {/* Sem resultados */}
        {!loading && users.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-gray-500 text-lg">Nenhum membro encontrado</p>
            <Button
              variant="primary"
              onClick={() => navigate('/users/new')}
              className="mt-4"
            >
              Adicionar Primeiro Membro
            </Button>
          </div>
        )}
      </div>

      {/* Modal de confirmação de ativar/desativar */}
      <Modal
        isOpen={!!toggleConfirm}
        title={toggleConfirm?.isActive ? 'Desativar Membro' : 'Ativar Membro'}
        onClose={() => setToggleConfirm(null)}
        onConfirm={handleToggleActive}
        confirmVariant={toggleConfirm?.isActive ? 'danger' : 'primary'}
        confirmText={toggleConfirm?.isActive ? 'Desativar' : 'Ativar'}
      >
        <p className="text-gray-700">
          Tem certeza que deseja{' '}
          {toggleConfirm?.isActive ? 'desativar' : 'ativar'} o membro{' '}
          <strong>{toggleConfirm?.name}</strong>?
        </p>
      </Modal>
    </div>
  );
};

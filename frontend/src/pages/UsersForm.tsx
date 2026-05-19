import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Navigate } from 'react-router-dom';
import {
  Alert,
  Button,
  Input,
  LoadingSpinner,
  Navbar,
  Select,
} from '../components';
import { useAuth } from '../contexts/AuthContext';
import { userService, CreateUserDTO, UpdateUserDTO } from '../services/userService';
import { UserRole } from '../types';

export const UsersForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;
  const { user: currentUser, isLoading: authLoading } = useAuth();

  const [loadingUser, setLoadingUser] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'RECEPTIONIST',
    specialty: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Carregar usuário para edição
  useEffect(() => {
    if (isEditing && id) {
      loadUser(id);
    }
  }, [id]);

  const loadUser = async (userId: string) => {
    setLoadingUser(true);
    try {
      const user = await userService.getById(userId);
      setFormData({
        name: user.name,
        email: user.email,
        password: '',
        role: user.role,
        specialty: user.specialty || '',
      });
    } catch {
      setFormError('Erro ao carregar membro. Verifique se ele ainda existe.');
    } finally {
      setLoadingUser(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!isEditing && !formData.password.trim()) {
      newErrors.password = 'Senha é obrigatória';
    }

    if (!isEditing && formData.password && formData.password.length < 8) {
      newErrors.password = 'Senha deve ter no mínimo 8 caracteres';
    }

    if (!formData.role) {
      newErrors.role = 'Função é obrigatória';
    }

    if (formData.role === UserRole.DOCTOR && !formData.specialty.trim()) {
      newErrors.specialty = 'Especialidade é obrigatória para médicos';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    if (!validateForm()) {
      setFormError('Por favor, corrija os erros no formulário');
      return;
    }

    setIsSaving(true);
    try {
      if (isEditing && id) {
        const updateData: UpdateUserDTO = {
          name: formData.name,
          email: formData.email,
          role: formData.role,
          specialty: formData.role === UserRole.DOCTOR ? formData.specialty : undefined,
        };
        await userService.update(id, updateData);
        setFormSuccess('Membro atualizado com sucesso!');
      } else {
        const createData: CreateUserDTO = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          specialty: formData.role === UserRole.DOCTOR ? formData.specialty : undefined,
        };
        await userService.create(createData);
        setFormSuccess('Membro criado com sucesso!');
      }

      setTimeout(() => navigate('/users'), 1500);
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        (isEditing ? 'Erro ao atualizar membro' : 'Erro ao criar membro');
      setFormError(message);
    } finally {
      setIsSaving(false);
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

  if (loadingUser) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center py-24">
          <LoadingSpinner size="lg" message="Carregando membro..." />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          {isEditing ? 'Editar Membro' : 'Novo Membro'}
        </h1>

        {/* Mensagens */}
        <div className="mb-6 space-y-3">
          {formError && <Alert type="error" message={formError} />}
          {formSuccess && <Alert type="success" message={formSuccess} />}
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow-lg p-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nome */}
            <div className="md:col-span-2">
              <Input
                label="Nome Completo"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
                placeholder="Ex: Dr. Carlos Souza"
                required
              />
            </div>

            {/* Email */}
            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              placeholder="email@clinica.com"
              required
            />

            {/* Senha (somente na criação) */}
            {!isEditing && (
              <Input
                label="Senha"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                placeholder="Mínimo 8 caracteres"
                required
              />
            )}

            {/* Função / Role */}
            <Select
              label="Função"
              name="role"
              value={formData.role}
              onChange={handleChange}
              error={errors.role}
              options={[
                { value: 'DOCTOR', label: 'Médico' },
                { value: 'RECEPTIONIST', label: 'Recepcionista' },
                { value: 'ADMIN', label: 'Administrador' },
              ]}
              required
            />

            {/* Especialidade (somente para médicos) */}
            {formData.role === UserRole.DOCTOR && (
              <div className={!isEditing ? 'md:col-span-2' : ''}>
                <Input
                  label="Especialidade"
                  name="specialty"
                  value={formData.specialty}
                  onChange={handleChange}
                  error={errors.specialty}
                  placeholder="Ex: Cardiologia"
                  required
                />
              </div>
            )}
          </div>

          {/* Botões */}
          <div className="flex gap-4 mt-8">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={isSaving}
              loading={isSaving}
            >
              {isEditing ? 'Atualizar' : 'Criar'} Membro
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="lg"
              onClick={() => navigate('/users')}
              disabled={isSaving}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

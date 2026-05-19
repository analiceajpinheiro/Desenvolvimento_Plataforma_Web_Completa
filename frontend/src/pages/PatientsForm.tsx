import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Alert, Button, Input, Navbar, Select, LoadingSpinner } from '../components';
import { usePatients } from '../hooks/usePatients';
import { Patient } from '../types';
import {
  validateCPF,
  validateEmail,
  validatePhone,
  formatCPF,
  formatPhone,
} from '../utils/validators';

export const PatientsForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { patients, loading, error, addPatient, updatePatient, fetchPatients } = usePatients();

  const [formData, setFormData] = useState<
    Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>
  >({
    name: '',
    cpf: '',
    birthDate: '',
    gender: '',
    phone: '',
    email: '',
    address: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Carregar paciente para edição
  useEffect(() => {
    if (id) {
      const patient = patients.find((p) => p.id === id);
      if (patient) {
        setFormData({
          name: patient.name,
          cpf: patient.cpf,
          birthDate: patient.birthDate.split('T')[0],
          gender: patient.gender,
          phone: patient.phone,
          email: patient.email,
          address: patient.address,
        });
      }
    }
  }, [id, patients]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!validateCPF(formData.cpf)) {
      newErrors.cpf = 'CPF inválido';
    }

    if (!formData.birthDate) {
      newErrors.birthDate = 'Data de nascimento é obrigatória';
    }

    if (!formData.gender) {
      newErrors.gender = 'Gênero é obrigatório';
    }

    if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Telefone inválido (11 dígitos)';
    }

    if (!validateEmail(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Endereço é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Limpar erro do campo ao editar
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 11);
    handleChange({
      ...e,
      target: {
        ...e.target,
        name: 'cpf',
        value,
      },
    });
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 11);
    handleChange({
      ...e,
      target: {
        ...e.target,
        name: 'phone',
        value,
      },
    });
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
      if (id) {
        await updatePatient(id, formData);
        setFormSuccess('Paciente atualizado com sucesso!');
      } else {
        await addPatient(formData);
        setFormSuccess('Paciente criado com sucesso!');
        setFormData({
          name: '',
          cpf: '',
          birthDate: '',
          gender: '',
          phone: '',
          email: '',
          address: '',
        });
      }

      setTimeout(() => {
        navigate('/patients');
      }, 1500);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Erro ao salvar paciente';
      setFormError(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          {id ? 'Editar Paciente' : 'Novo Paciente'}
        </h1>

        {/* Mensagens */}
        <div className="mb-6 space-y-3">
          {formError && <Alert type="error" message={formError} />}
          {formSuccess && (
            <Alert type="success" message={formSuccess} />
          )}
          {error && <Alert type="error" message={error} />}
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nome */}
            <div className="md:col-span-2">
              <Input
                label="Nome Completo"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
                placeholder="Ex: João Silva"
                required
              />
            </div>

            {/* CPF */}
            <Input
              label="CPF"
              name="cpf"
              value={formatCPF(formData.cpf)}
              onChange={handleCPFChange}
              error={errors.cpf}
              placeholder="000.000.000-00"
              maxLength={14}
            />

            {/* Data de Nascimento */}
            <Input
              label="Data de Nascimento"
              name="birthDate"
              type="date"
              value={formData.birthDate}
              onChange={handleChange}
              error={errors.birthDate}
              required
            />

            {/* Gênero */}
            <Select
              label="Gênero"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              error={errors.gender}
              options={[
                { value: 'M', label: 'Masculino' },
                { value: 'F', label: 'Feminino' },
                { value: 'O', label: 'Outro' },
              ]}
            />

            {/* Telefone */}
            <Input
              label="Telefone"
              name="phone"
              value={formatPhone(formData.phone)}
              onChange={handlePhoneChange}
              error={errors.phone}
              placeholder="(11) 99999-9999"
              maxLength={15}
            />

            {/* Email */}
            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              placeholder="email@example.com"
              required
            />

            {/* Endereço */}
            <div className="md:col-span-2">
              <Input
                label="Endereço Completo"
                name="address"
                value={formData.address}
                onChange={handleChange}
                error={errors.address}
                placeholder="Rua, número, bairro, cidade"
                required
              />
            </div>
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
              {id ? 'Atualizar' : 'Criar'} Paciente
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="lg"
              onClick={() => navigate('/patients')}
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

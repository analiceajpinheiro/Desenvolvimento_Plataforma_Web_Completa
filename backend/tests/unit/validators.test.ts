import {
  validateCPF,
  validateEmail,
  validatePhone,
  validatePassword,
  validateCreatePatientInput,
  validateCreateUserInput,
} from '../../src/utils/validators';
import { ValidationError } from '../../src/utils/errors';

describe('Validators', () => {
  describe('validateCPF', () => {
    it('deve validar um CPF válido', () => {
      // CPF de teste válido
      expect(validateCPF('11144477735')).toBe(true);
    });

    it('deve rejeitar CPF com comprimento inválido', () => {
      expect(validateCPF('111444777')).toBe(false);
    });

    it('deve rejeitar CPF com todos os dígitos iguais', () => {
      expect(validateCPF('11111111111')).toBe(false);
    });

    it('deve rejeitar CPF com dígito verificador inválido', () => {
      expect(validateCPF('11144477736')).toBe(false);
    });

    it('deve remover formatação e validar', () => {
      expect(validateCPF('111.444.777-35')).toBe(true);
    });
  });

  describe('validateEmail', () => {
    it('deve validar email válido', () => {
      expect(validateEmail('usuario@example.com')).toBe(true);
    });

    it('deve rejeitar email sem domínio', () => {
      expect(validateEmail('usuario@')).toBe(false);
    });

    it('deve rejeitar email sem @', () => {
      expect(validateEmail('usuario.example.com')).toBe(false);
    });

    it('deve rejeitar email com espaços', () => {
      expect(validateEmail('usuario @example.com')).toBe(false);
    });
  });

  describe('validatePhone', () => {
    it('deve validar telefone com 11 dígitos', () => {
      expect(validatePhone('11987654321')).toBe(true);
    });

    it('deve rejeitar telefone com menos de 11 dígitos', () => {
      expect(validatePhone('119876543')).toBe(false);
    });

    it('deve remover formatação e validar', () => {
      expect(validatePhone('(11) 98765-4321')).toBe(true);
    });
  });

  describe('validatePassword', () => {
    it('deve validar senha com requisitos mínimos', () => {
      expect(validatePassword('Senha123')).toBe(true);
    });

    it('deve rejeitar senha sem letra maiúscula', () => {
      expect(validatePassword('senha123')).toBe(false);
    });

    it('deve rejeitar senha sem letra minúscula', () => {
      expect(validatePassword('SENHA123')).toBe(false);
    });

    it('deve rejeitar senha sem número', () => {
      expect(validatePassword('SenhaABC')).toBe(false);
    });

    it('deve rejeitar senha com menos de 8 caracteres', () => {
      expect(validatePassword('Snh12')).toBe(false);
    });
  });

  describe('validateCreatePatientInput', () => {
    const validData = {
      name: 'João Silva',
      cpf: '11144477735',
      birthDate: '1990-05-15',
      gender: 'M',
      phone: '11987654321',
      email: 'joao@example.com',
      address: 'Rua A, 123',
    };

    it('deve validar dados corretos do paciente', () => {
      expect(() => validateCreatePatientInput(validData)).not.toThrow();
    });

    it('deve rejeitar dados com nome vazio', () => {
      expect(() =>
        validateCreatePatientInput({ ...validData, name: '' })
      ).toThrow(ValidationError);
    });

    it('deve rejeitar dados com CPF inválido', () => {
      expect(() =>
        validateCreatePatientInput({ ...validData, cpf: 'invalid' })
      ).toThrow(ValidationError);
    });

    it('deve rejeitar dados com email inválido', () => {
      expect(() =>
        validateCreatePatientInput({ ...validData, email: 'invalid' })
      ).toThrow(ValidationError);
    });
  });

  describe('validateCreateUserInput', () => {
    const validData = {
      name: 'Dr. João',
      email: 'dr.joao@example.com',
      password: 'Senha123',
      role: 'DOCTOR',
      specialty: 'Cardiologia',
    };

    it('deve validar dados corretos do usuário', () => {
      expect(() => validateCreateUserInput(validData)).not.toThrow();
    });

    it('deve rejeitar dados com email inválido', () => {
      expect(() =>
        validateCreateUserInput({ ...validData, email: 'invalid' })
      ).toThrow(ValidationError);
    });

    it('deve rejeitar dados com senha fraca', () => {
      expect(() =>
        validateCreateUserInput({ ...validData, password: 'weak' })
      ).toThrow(ValidationError);
    });

    it('deve rejeitar role inválido', () => {
      expect(() =>
        validateCreateUserInput({ ...validData, role: 'INVALID' })
      ).toThrow(ValidationError);
    });

    it('deve rejeitar médico sem especialidade', () => {
      expect(() =>
        validateCreateUserInput({
          ...validData,
          role: 'DOCTOR',
          specialty: '',
        })
      ).toThrow(ValidationError);
    });
  });
});

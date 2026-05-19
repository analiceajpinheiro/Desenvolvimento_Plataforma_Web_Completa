import { describe, it, expect } from 'vitest';
import {
  validateEmail,
  validateCPF,
  validatePhone,
  validateDate,
  formatCPF,
  formatPhone,
  formatDate,
  calculateAge,
} from '../utils/validators';

describe('Validators Utilities', () => {
  describe('validateEmail', () => {
    it('Deve validar email correto', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name@domain.co.uk')).toBe(true);
    });

    it('Deve rejeitar email inválido', () => {
      expect(validateEmail('invalid')).toBe(false);
      expect(validateEmail('invalid@')).toBe(false);
      expect(validateEmail('@domain.com')).toBe(false);
    });
  });

  describe('validateCPF', () => {
    it('Deve validar CPF com formato válido', () => {
      // Nota: usar CPF válido real para testes
      expect(validateCPF('00000000191')).toBe(true);
    });

    it('Deve rejeitar CPF com tamanho incorreto', () => {
      expect(validateCPF('123')).toBe(false);
      expect(validateCPF('123456789')).toBe(false);
    });

    it('Deve rejeitar CPF com dígitos repetidos', () => {
      expect(validateCPF('11111111111')).toBe(false);
      expect(validateCPF('00000000000')).toBe(false);
    });
  });

  describe('validatePhone', () => {
    it('Deve validar telefone com 11 dígitos', () => {
      expect(validatePhone('11999999999')).toBe(true);
      expect(validatePhone('(11)99999-9999')).toBe(true);
    });

    it('Deve rejeitar telefone com tamanho incorreto', () => {
      expect(validatePhone('123')).toBe(false);
      expect(validatePhone('119999999')).toBe(false);
    });
  });

  describe('validateDate', () => {
    it('Deve validar data válida', () => {
      expect(validateDate('2025-12-25')).toBe(true);
      expect(validateDate('1990-01-15')).toBe(true);
    });

    it('Deve rejeitar data inválida', () => {
      expect(validateDate('invalid')).toBe(false);
      expect(validateDate('2025-13-01')).toBe(false);
    });
  });

  describe('formatCPF', () => {
    it('Deve formatar CPF corretamente', () => {
      expect(formatCPF('12345678901')).toBe('123.456.789-01');
      expect(formatCPF('00000000191')).toBe('000.000.001-91');
    });
  });

  describe('formatPhone', () => {
    it('Deve formatar telefone corretamente', () => {
      expect(formatPhone('11999999999')).toBe('(11) 99999-9999');
    });
  });

  describe('formatDate', () => {
    it('Deve formatar data para pt-BR', () => {
      const date = new Date('2025-12-25');
      const formatted = formatDate(date);
      expect(formatted).toContain('25');
      expect(formatted).toContain('12');
      expect(formatted).toContain('2025');
    });
  });

  describe('calculateAge', () => {
    it('Deve calcular idade corretamente', () => {
      const birthDate = '1990-01-15';
      const age = calculateAge(birthDate);
      const expectedAge = new Date().getFullYear() - 1990;
      expect(age).toBeGreaterThanOrEqual(expectedAge - 1);
      expect(age).toBeLessThanOrEqual(expectedAge);
    });
  });
});

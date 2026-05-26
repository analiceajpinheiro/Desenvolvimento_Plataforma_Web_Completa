import { authService } from '../../src/services';
import { UnauthorizedError, ConflictError } from '../../src/utils/errors';
import * as userRepo from '../../src/repositories';
import * as bcrypt from 'bcrypt';

// Mock do repositório de usuário
jest.mock('../../src/repositories', () => ({
  userRepository: {
    findByEmail: jest.fn(),
    create: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
  },
}));

// Mock do bcrypt
jest.mock('bcrypt');

describe('Auth Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('deve registrar um novo usuário com sucesso', async () => {
      const userData = {
        name: 'Dr. João',
        email: 'dr.joao@example.com',
        password: 'Senha123',
        role: 'DOCTOR',
        specialty: 'Cardiologia',
      };

      const mockUser = {
        id: 'user-1',
        ...userData,
        password: 'hashed-password',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (userRepo.userRepository.create as jest.Mock).mockResolvedValue(mockUser);

      const result = await authService.register(userData);

      expect(result.user).toBeDefined();
      expect(result.token).toBeDefined();
      expect(userRepo.userRepository.create).toHaveBeenCalled();
    });

    it('deve rejeitar registro com email inválido', async () => {
      const userData = {
        name: 'Dr. João',
        email: 'invalid-email',
        password: 'Senha123',
        role: 'DOCTOR',
        specialty: 'Cardiologia',
      };

      await expect(authService.register(userData)).rejects.toThrow();
    });

    it('deve rejeitar registro com senha fraca', async () => {
      const userData = {
        name: 'Dr. João',
        email: 'dr.joao@example.com',
        password: 'weak',
        role: 'DOCTOR',
        specialty: 'Cardiologia',
      };

      await expect(authService.register(userData)).rejects.toThrow();
    });
  });

  describe('login', () => {
    it('deve fazer login com credenciais válidas', async () => {
      const mockUser = {
        id: 'user-1',
        email: 'dr.joao@example.com',
        name: 'Dr. João',
        password: '$2b$10$hashedpassword',
        role: 'DOCTOR',
        specialty: 'Cardiologia',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (userRepo.userRepository.findByEmail as jest.Mock).mockResolvedValue(mockUser);

      // Mock bcrypt compare
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await authService.login(
        'dr.joao@example.com',
        'Senha123'
      );

      expect(result.token).toBeDefined();
      expect(userRepo.userRepository.findByEmail).toHaveBeenCalledWith(
        'dr.joao@example.com'
      );
    });

    it('deve rejeitar login com email não registrado', async () => {
      (userRepo.userRepository.findByEmail as jest.Mock).mockResolvedValue(null);

      await expect(
        authService.login('inexistent@example.com', 'Senha123')
      ).rejects.toThrow(UnauthorizedError);
    });
  });

  describe('generateToken', () => {
    it('deve gerar um token válido', () => {
      const token = authService.generateToken('user-1');
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
    });
  });

  describe('verifyToken', () => {
    it('deve verificar um token válido', () => {
      const token = authService.generateToken('user-1');
      const userId = authService.verifyToken(token);
      expect(userId).toBe('user-1');
    });

    it('deve rejeitar token inválido', () => {
      expect(() => authService.verifyToken('invalid-token')).toThrow(
        UnauthorizedError
      );
    });

    it('deve rejeitar token expirado', () => {
      // Gerar token com expiração imediata
      const jwt = require('jsonwebtoken');
      const expiredToken = jwt.sign({ userId: 'user-1' }, 'secret-key', {
        expiresIn: '0s',
      });

      // Aguardar para garantir expiração
      setTimeout(() => {
        expect(() => authService.verifyToken(expiredToken)).toThrow(
          UnauthorizedError
        );
      }, 100);
    });
  });

  describe('changePassword', () => {
    it('deve alterar senha com sucesso', async () => {
      const mockUser = {
        id: 'user-1',
        email: 'dr.joao@example.com',
        name: 'Dr. João',
        password: '$2b$10$hashedpassword',
        role: 'DOCTOR',
        specialty: 'Cardiologia',
        isActive: true,
      };

      (userRepo.userRepository.findById as jest.Mock).mockResolvedValue(mockUser);
      (userRepo.userRepository.update as jest.Mock).mockResolvedValue({
        ...mockUser,
        password: '$2b$10$newhashed',
      });

      // Mock bcrypt
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (bcrypt.hash as jest.Mock).mockResolvedValue('$2b$10$newhashed');

      const result = await authService.changePassword(
        'user-1',
        'SenhaAntiga123',
        'SenhaNovaValida123'
      );

      expect(userRepo.userRepository.update).toHaveBeenCalled();
    });

    it('deve rejeitar se senha atual for incorreta', async () => {
      const mockUser = {
        id: 'user-1',
        email: 'dr.joao@example.com',
        name: 'Dr. João',
        password: '$2b$10$hashedpassword',
        role: 'DOCTOR',
        specialty: 'Cardiologia',
        isActive: true,
      };

      (userRepo.userRepository.findById as jest.Mock).mockResolvedValue(mockUser);

      // Mock bcrypt
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        authService.changePassword('user-1', 'SenhaErrada', 'SenhaNovaValida123')
      ).rejects.toThrow(UnauthorizedError);
    });
  });
});

import { Request, Response, NextFunction } from 'express';
import { authService } from '../services';
import { UnauthorizedError, AppError } from '../utils/errors';

// Estender Request para incluir userId
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

// Middleware de autenticação JWT
export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('Token não fornecido ou inválido');
    }

    const token = authHeader.substring(7);
    const userId = authService.verifyToken(token);
    req.userId = userId;

    next();
  } catch (err) {
    if (err instanceof AppError) {
      return res.status(err.statusCode).json({
        success: false,
        message: err.message,
        code: err.code,
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Erro ao validar token',
    });
  }
};

// Middleware de validação de role
export const roleMiddleware = (allowedRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.userId) {
        throw new UnauthorizedError('Usuário não autenticado');
      }

      const { userService } = await import('../services');
      const user = await userService.getUserById(req.userId);

      if (!allowedRoles.includes(user.role)) {
        throw new UnauthorizedError('Acesso negado para este recurso');
      }

      next();
    } catch (err) {
      if (err instanceof AppError) {
        return res.status(err.statusCode).json({
          success: false,
          message: err.message,
          code: err.code,
        });
      }

      return res.status(401).json({
        success: false,
        message: 'Erro ao validar permissões',
      });
    }
  };
};

// Middleware de tratamento de erros global
export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', err);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      code: err.code,
    });
  }

  // Erro genérico
  return res.status(500).json({
    success: false,
    message: 'Erro interno do servidor',
    code: 'INTERNAL_SERVER_ERROR',
  });
};

// Middleware de validação de JSON
export const jsonErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof SyntaxError && 'body' in err) {
    return res.status(400).json({
      success: false,
      message: 'JSON inválido no corpo da requisição',
      code: 'INVALID_JSON',
    });
  }
  next(err);
};

// Middleware para log de requisições
export const requestLoggerMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const startTime = Date.now();
  const { method, path } = req;

  res.on('finish', () => {
    const duration = Date.now() - startTime;
    console.log(`[${method}] ${path} - ${res.statusCode} (${duration}ms)`);
  });

  next();
};

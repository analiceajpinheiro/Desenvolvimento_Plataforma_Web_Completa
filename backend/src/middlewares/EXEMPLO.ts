// Exemplo de middleware de autenticação
// Este é um template para orientar a estrutura de middlewares

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

/**
 * Middlewares são funções que:
 * 1. Recebem (request, response, next)
 * 2. Executam lógica antes de chegar ao controller
 * 3. Chamam next() para prosseguir ou retornam erro
 * 
 * Casos de uso:
 * - Autenticação (verificar JWT)
 * - Validação de dados
 * - Tratamento de erros
 * - Logging
 */

// Exemplo: Middleware de Autenticação
export function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // 1. Extrair token do header
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Token não fornecido',
      });
    }

    // 2. Verificar e decodificar JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');

    // 3. Armazenar dados do usuário no request
    (req as any).user = decoded;

    // 4. Prosseguir para o próximo middleware/controller
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      error: 'Token inválido',
    });
  }
}

// Exemplo: Middleware de Validação
export function validateInput(schema: any) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validar com biblioteca como Zod ou Joi
      // const validated = schema.parse(req.body);
      // (req as any).validatedData = validated;
      next();
    } catch (error) {
      res.status(400).json({
        success: false,
        error: 'Dados inválidos',
      });
    }
  };
}

// Exemplo: Middleware de Tratamento de Erros (deve ser o último)
export function errorHandler(
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error('Erro:', error);

  res.status(error.status || 500).json({
    success: false,
    error: error.message || 'Erro interno do servidor',
  });
}
